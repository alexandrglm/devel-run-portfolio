
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setIsLoading } from './appSlice';
import axios from 'axios';

axios.defaults.withCredentials = true;



export const fetchWikiPages = createAsyncThunk(
'wiki/fetchPages',
async (_, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  try {
    const res = await axios.get('/api/wiki');
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const fetchAdminWikiPages = createAsyncThunk(
'wiki/fetchAdmin',
async (_, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  try {
    const res = await axios.get('/api/wiki/admin');
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const fetchWikiPageBySlug = createAsyncThunk(
'wiki/fetchBySlug',
async (slug, { dispatch, rejectWithValue }) => {
  if (!slug) {
    return rejectWithValue('Slug is required');
  }
  dispatch(setIsLoading(true));
  try {
    const res = await axios.get(`/api/wiki/slug/${encodeURIComponent(slug)}`);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const fetchWikiPageById = createAsyncThunk(
'wiki/fetchById',
async (id, { dispatch, rejectWithValue }) => {
  if (!id) {
    return rejectWithValue('ID is required');
  }
  dispatch(setIsLoading(true));
  try {
    const res = await axios.get(`/api/wiki/${id}`);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const createWikiPage = createAsyncThunk(
'wiki/create',
async (pageData, { dispatch, rejectWithValue }) => {
  if (!pageData || !pageData.title) {
    return rejectWithValue('Title is required');
  }
  dispatch(setIsLoading(true));
  try {
    const res = await axios.post('/api/wiki', pageData);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const updateWikiPage = createAsyncThunk(
'wiki/update',
async ({ id, data }, { dispatch, rejectWithValue }) => {
  if (!id) {
    return rejectWithValue('ID is required for update');
  }
  dispatch(setIsLoading(true));
  try {
    const res = await axios.put(`/api/wiki/${id}`, data);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const deleteWikiPage = createAsyncThunk(
'wiki/delete',
async (id, { dispatch, rejectWithValue }) => {
  if (!id) {
    return rejectWithValue('ID is required for deletion');
  }
  dispatch(setIsLoading(true));
  try {
    await axios.delete(`/api/wiki/${id}`);
    dispatch(setIsLoading(false));
    return id;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const fetchWikiTree = createAsyncThunk(
'wiki/fetchTree',
async (rootId = null, { dispatch, rejectWithValue }) => {
  dispatch(setIsLoading(true));
  try {
    const url = rootId ? `/api/wiki/tree/${rootId}` : '/api/wiki/tree';
    const res = await axios.get(url);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});



export const searchWiki = createAsyncThunk(
'wiki/search',
async (query, { dispatch, rejectWithValue }) => {
  if (!query || query.trim().length < 2) {
    return rejectWithValue('Search query must be at least 2 characters');
  }
  dispatch(setIsLoading(true));
  try {
    const res = await axios.get(`/api/wiki/search/${encodeURIComponent(query.trim())}`);
    dispatch(setIsLoading(false));
    return res.data;
  } catch (err) {
    dispatch(setIsLoading(false));
    return rejectWithValue(err.response?.data?.error || err.message);
  }
});






const wikiSlice = createSlice({
  name: 'wiki',
  initialState: {
    items: [],
    currentPage: null,
    tree: [],
    searchResults: [],
    loading: false,
    error: null,


    createStatus: 'idle',
    updateStatus: 'idle',
    deleteStatus: 'idle',
    operationError: null
  },
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
      state.operationError = null;
    },

    resetOperationStatus: (state) => {
      state.createStatus = 'idle';
      state.updateStatus = 'idle';
      state.deleteStatus = 'idle';
      state.operationError = null;
    }
  },
  extraReducers: (builder) => {

    builder.


    addCase(fetchWikiPages.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(fetchWikiPages.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload || [];
      state.error = null;
    }).
    addCase(fetchWikiPages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    }).


    addCase(fetchAdminWikiPages.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(fetchAdminWikiPages.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload || [];
      state.error = null;
    }).
    addCase(fetchAdminWikiPages.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    }).



    addCase(fetchWikiPageBySlug.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(fetchWikiPageBySlug.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPage = action.payload;
      state.error = null;
    }).
    addCase(fetchWikiPageBySlug.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
      state.currentPage = null;
    }).


    addCase(fetchWikiPageById.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(fetchWikiPageById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentPage = action.payload;
      state.error = null;
    }).
    addCase(fetchWikiPageById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
      state.currentPage = null;
    }).


    addCase(createWikiPage.pending, (state) => {
      state.createStatus = 'loading';
      state.operationError = null;
      state.error = null;
    }).
    addCase(createWikiPage.fulfilled, (state, action) => {
      state.createStatus = 'succeeded';
      state.items.unshift(action.payload);
      state.operationError = null;
      state.error = null;
    }).
    addCase(createWikiPage.rejected, (state, action) => {
      state.createStatus = 'failed';
      state.operationError = action.payload || action.error.message;
      state.error = action.payload || action.error.message;
    }).


    addCase(updateWikiPage.pending, (state) => {
      state.updateStatus = 'loading';
      state.operationError = null;
      state.error = null;
    }).
    addCase(updateWikiPage.fulfilled, (state, action) => {
      state.updateStatus = 'succeeded';
      const index = state.items.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
      if (state.currentPage?._id === action.payload._id) {
        state.currentPage = action.payload;
      }
      state.operationError = null;
      state.error = null;
    }).
    addCase(updateWikiPage.rejected, (state, action) => {
      state.updateStatus = 'failed';
      state.operationError = action.payload || action.error.message;
      state.error = action.payload || action.error.message;
    }).


    addCase(deleteWikiPage.pending, (state) => {
      state.deleteStatus = 'loading';
      state.operationError = null;
      state.error = null;
    }).
    addCase(deleteWikiPage.fulfilled, (state, action) => {
      state.deleteStatus = 'succeeded';
      state.items = state.items.filter((p) => p._id !== action.payload);
      if (state.currentPage?._id === action.payload) {
        state.currentPage = null;
      }
      state.operationError = null;
      state.error = null;
    }).
    addCase(deleteWikiPage.rejected, (state, action) => {
      state.deleteStatus = 'failed';
      state.operationError = action.payload || action.error.message;
      state.error = action.payload || action.error.message;
    }).


    addCase(fetchWikiTree.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(fetchWikiTree.fulfilled, (state, action) => {
      state.loading = false;
      state.tree = action.payload || [];
      state.error = null;
    }).
    addCase(fetchWikiTree.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
      state.tree = [];
    }).


    addCase(searchWiki.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).
    addCase(searchWiki.fulfilled, (state, action) => {
      state.loading = false;
      state.searchResults = action.payload || [];
      state.error = null;
    }).
    addCase(searchWiki.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
      state.searchResults = [];
    });
  }
});






export const {
  clearCurrentPage,
  clearSearch,
  clearError,
  resetOperationStatus
} = wikiSlice.actions;

export default wikiSlice.reducer;