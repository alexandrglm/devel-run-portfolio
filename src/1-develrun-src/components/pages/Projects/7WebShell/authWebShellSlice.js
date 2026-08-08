



import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  isAuthenticated: false,
  user: null,
  isChecking: true
};


const authSlice = createSlice({

  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.isChecking = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.isChecking = false;
    },
    restoreAuth: (state, action) => {
      state.isAuthenticated = true,
      state.user = action.payload.user;
      state.isChecking = false;
    },
    setChecking: (state, action) => {

      state.isChecking = true;

    }
  }
});


export const { login, logout, restoreAuth, setChecking } = authSlice.actions;
export default authSlice.reducer;