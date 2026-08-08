import { configureStore } from '@reduxjs/toolkit'
import appReducer from './slices/appSlice'
import postsReducer from './slices/postsSlice'
import authReducer from './slices/authSlice'
import wikiSlice from './slices/wikiSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        posts: postsReducer,
        auth: authReducer
    }
})
