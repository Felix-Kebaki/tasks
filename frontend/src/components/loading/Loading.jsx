import React from 'react'
import './loading.css'

export  function Loading() {
  return (
    <div className="LoaderMainDiv">
        <div>
      <svg className="TickLoader" viewBox="0 0 52 52">
        <path 
          d="M14 27 L22 35 L38 19" 
          fill="none" 
          stroke="#0483bb" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          className="fill" 
          d="M14 27 L22 35 L38 19" 
          fill="none" 
          stroke="white" 
          strokeWidth="5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      </div>
    </div>
  )
}
