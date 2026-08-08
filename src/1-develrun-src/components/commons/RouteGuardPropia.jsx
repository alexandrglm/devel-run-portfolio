import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { verifyAuth } from '../../store/slices/authSlice'

export default function Protected({ children }) {

    const dispatch = useDispatch()
    const { isAuthenticated, loading } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(verifyAuth())
    }, [dispatch])

    if (loading) {
        return <div className="page">Verificando sesión...</div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}
