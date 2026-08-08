import { useState, useEffect } from 'react'

export const useDemo = (initialValue) => {
    const [value, setValue] = useState(initialValue)
    const [history, setHistory] = useState([initialValue])

    useEffect(() => {
        setHistory(prev => [...prev, value])
    }, [value])

    return { value, setValue, history }
}
