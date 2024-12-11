import React from 'react'
import '../css/getBldgBtn.css'

function Button({children, onClick}) {
  return (
    <div className='getBldgBtn' onClick={onClick}>
      {children}
    </div>
  )
}

export default Button
