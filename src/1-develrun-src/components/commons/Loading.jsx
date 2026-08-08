import React from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSync } from '@fortawesome/free-solid-svg-icons'

export default function Loading() {

  const isLoading = useSelector(state => state.app.isLoading || state.app.loading)

  if (!isLoading) return null

  return (

    <div className="loading-overlay" role="status" aria-live="polite">
      
      <div className="loading-inner">
      
        <FontAwesomeIcon icon={faSync} size="5x" className="loading-spinner" spin={true} />
      
        <div className="loading-text">Processing ...</div>
      </div>
    </div>
  )
}
