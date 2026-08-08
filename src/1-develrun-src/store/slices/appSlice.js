import { createSlice } from '@reduxjs/toolkit'

const THEME_STORAGE_KEY = 'app_theme'

const loadInitialTheme = () => {
    if (typeof window === 'undefined' || !window.localStorage) {
        return 'dark'
    }

    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' ? stored : 'dark'
}

const appSlice = createSlice({
    name: 'app',
    initialState: {
        theme: loadInitialTheme(),
        isAdmin: false,
        demoCounter: 0,
        demoBgColor: '#00ff88',
        loading: false,
        isLoading: false,
        error: null,
        status: { message: '' }
    },
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light'
        },
        setAdmin: (state, action) => {
            state.isAdmin = action.payload
        },
        setLoading: (state, action) => {
            state.loading = !!action.payload
            state.isLoading = !!action.payload
        },
        setIsLoading: (state, action) => {
            state.isLoading = !!action.payload
            state.loading = !!action.payload
        },
        setError: (state, action) => {
            state.error = action.payload || null
        },
        setStatus: (state, action) => {
            state.status = action.payload || { message: '' }
        },
        incrementCounter: (state) => {
            state.demoCounter += 1
        },
        setDemoBgColor: (state, action) => {
            state.demoBgColor = action.payload
        },
        setTerminalTheme: (state, action) => {
            state.terminalTheme = action.payload
        },
        setIsWebshellFullscreen: (state, action) => {
            state.isWebshellFullscreen = action.payload
        }
    }
})

export const { toggleTheme, setAdmin, setLoading, setIsLoading, setError, setStatus, incrementCounter, setDemoBgColor, setTerminalTheme, setIsWebshellFullscreen } = appSlice.actions
export default appSlice.reducer
