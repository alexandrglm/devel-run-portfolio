import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { setIsLoading } from './appSlice'
import axios from 'axios'

axios.defaults.withCredentials = true;

export const fetchPosts = createAsyncThunk('posts/fetch', async (_, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(setIsLoading(true))
    try {
        const res = await axios.get('/api/posts')
        dispatch(setIsLoading(false))
        return res.data
    } catch (err) {
        dispatch(setIsLoading(false))
        throw err
    }
})

export const fetchAdminPosts = createAsyncThunk('posts/fetchAdmin', async (_, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(setIsLoading(true))
    try {
        const res = await axios.get('/api/posts/admin')
        dispatch(setIsLoading(false))
        return res.data
    } catch (err) {
        dispatch(setIsLoading(false))
        throw err
    }
})

export const fetchPostBySlug = createAsyncThunk('posts/fetchBySlug', async (slug, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(setIsLoading(true))
    try {
        const res = await axios.get(`/api/posts/slug/${slug}`)
        dispatch(setIsLoading(false))
        return res.data
    } catch (err) {
        dispatch(setIsLoading(false))
        throw err
    }
})

export const createPost = createAsyncThunk('posts/create', async (post, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(setIsLoading(true))
    try {
        const res = await axios.post('/api/posts', post)
        dispatch(setIsLoading(false))
        return res.data
    } catch (err) {
        dispatch(setIsLoading(false))
        throw err
    }
})

export const updatePost = createAsyncThunk('posts/update', async ({ id, data }, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(setIsLoading(true))
    try {
        const res = await axios.put(`/api/posts/${id}`, data)
        dispatch(setIsLoading(false))
        return res.data
    } catch (err) {
        dispatch(setIsLoading(false))
        throw err
    }
})

export const deletePost = createAsyncThunk('posts/delete', async (id, thunkAPI) => {
    const { dispatch } = thunkAPI
    dispatch(setIsLoading(true))
    try {
        await axios.delete(`/api/posts/${id}`)
        dispatch(setIsLoading(false))
        return id
    } catch (err) {
        dispatch(setIsLoading(false))
        throw err
    }
})

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        items: [],
        currentPost: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentPost: (state) => {
            state.currentPost = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.loading = true
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
        })
        .addCase(fetchAdminPosts.fulfilled, (state, action) => {
            state.items = action.payload
        })
        .addCase(fetchPostBySlug.fulfilled, (state, action) => {
            state.currentPost = action.payload
        })
        .addCase(createPost.fulfilled, (state, action) => {
            state.items.unshift(action.payload)
        })
        .addCase(updatePost.fulfilled, (state, action) => {
            const idx = state.items.findIndex(p => p._id === action.payload._id)
            if (idx !== -1) state.items[idx] = action.payload
        })
        .addCase(deletePost.fulfilled, (state, action) => {
            state.items = state.items.filter(p => p._id !== action.payload)
        })
    }
})

export const { clearCurrentPost } = postsSlice.actions
export default postsSlice.reducer
