import { useEffect, useState } from 'react'

export function useDebugMode() {
    const [isDebugMode, setIsDebugMode] = useState(false)

    useEffect(() => {
        // Check if debug parameter exists in URL
        const urlParams = new URLSearchParams(window.location.search)
        const debugParam = urlParams.get('debug')

        // Enable debug mode if debug parameter is present (any value)
        const debugEnabled = debugParam !== null

        setIsDebugMode(debugEnabled)
    }, [])

    return isDebugMode
}