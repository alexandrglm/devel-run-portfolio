import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setIsLoading } from './appSlice';
import NodeRSA from 'node-rsa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const RSA_PUBLIC_KEY = import.meta.env.VITE_RSA_PUBLIC_KEY;

console.log('[AUTH] ========================================');
console.log('[AUTH] API_BASE_URL:', API_BASE_URL || '(usando proxy)');
console.log('[AUTH] RSA_PUBLIC_KEY existe?', RSA_PUBLIC_KEY ? '✅ Sí' : '❌ NO');
console.log('[AUTH] ========================================');




let rsaPublicKey;
try {
  rsaPublicKey = new NodeRSA(RSA_PUBLIC_KEY);
  rsaPublicKey.setOptions({ encryptionScheme: 'pkcs1' });
  console.log('[RSA] ✅ Clave pública cargada correctamente');
} catch (error) {
  console.error('[RSA] ❌ Error al cargar clave pública:', error.message);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = createAsyncThunk('auth/login', async ({ username, password }, { rejectWithValue, dispatch }) => {
  console.log('[LOGIN] ========================================');
  console.log('[LOGIN] 📝 Iniciando login...');
  console.log('[LOGIN] 👤 Username:', username);
  console.log('[LOGIN] 🔐 Password original:', password);
  console.log('[LOGIN] 🔑 RSA_PUBLIC_KEY existe?', RSA_PUBLIC_KEY ? '✅ Sí' : '❌ NO');

  try {
    dispatch(setIsLoading(true));

    if (!rsaPublicKey) {
      console.error('[LOGIN] ❌ RSA Public Key no cargada');
      dispatch(setIsLoading(false));
      return rejectWithValue('Error de configuración de seguridad');
    }


    console.log('[LOGIN] 🔐 Cifrando con RSA (clave pública)...');
    let encryptedPassword;
    try {
      encryptedPassword = rsaPublicKey.encrypt(password, 'base64');
      console.log('[LOGIN] 🔐 Password cifrada:', encryptedPassword.substring(0, 30) + '...');
      console.log('[LOGIN] 🔐 Longitud cifrada:', encryptedPassword.length);
    } catch (encryptError) {
      console.error('[LOGIN] ❌ Error al cifrar RSA:', encryptError.message);
      console.error('[LOGIN] ❌ Stack:', encryptError.stack);
      dispatch(setIsLoading(false));
      return rejectWithValue('Error al cifrar la contraseña');
    }

    if (!encryptedPassword) {
      console.log('[LOGIN] ❌ Password cifrada vacía');
      dispatch(setIsLoading(false));
      return rejectWithValue('Error al cifrar la contraseña');
    }

    console.log('[LOGIN] 📤 Enviando petición a:', `${API_BASE_URL || ''}/api/auth/login`);
    console.log('[LOGIN] 📤 Body:', { username, password: '***CIFRADO RSA***' });

    const res = await api.post('/api/auth/login', {
      username,
      password: encryptedPassword
    });

    console.log('[LOGIN] 📥 Respuesta recibida:', res.status, res.statusText);
    console.log('[LOGIN] 📥 Data:', JSON.stringify(res.data, null, 2));

    if (res.data.success) {
      console.log('[LOGIN] ✅ Login exitoso para:', username);
    } else {
      console.log('[LOGIN] ⚠️ Login falló:', res.data);
    }

    console.log('[LOGIN] ========================================');
    dispatch(setIsLoading(false));
    return res.data;

  } catch (error) {
    console.error('[LOGIN] ❌ Error en petición:', error.message);
    console.error('[LOGIN] ❌ Response:', error.response?.data);
    console.error('[LOGIN] ❌ Status:', error.response?.status);
    console.error('[LOGIN] ❌ Stack:', error.stack);
    console.log('[LOGIN] ========================================');
    dispatch(setIsLoading(false));
    return rejectWithValue(error.response?.data?.error || 'Error de login');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  console.log('[LOGOUT] 📝 Cerrando sesión...');
  await api.post('/api/auth/logout');
  console.log('[LOGOUT] ✅ Sesión cerrada');
});

export const verifyAuth = createAsyncThunk('auth/verify', async (_, { rejectWithValue, dispatch }) => {
  console.log('[VERIFY] 📝 Verificando autenticación...');
  try {
    dispatch(setIsLoading(true));
    const res = await api.get('/api/auth/verify');
    console.log('[VERIFY] ✅ Autenticado:', res.data);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (error) {
    console.error('[VERIFY] ❌ Error:', error.response?.data || error.message);
    dispatch(setIsLoading(false));
    return rejectWithValue('No autenticado');
  }
});




const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.
    addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    }).
    addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }).
    addCase(logout.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }).
    addCase(verifyAuth.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
    }).
    addCase(verifyAuth.rejected, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;