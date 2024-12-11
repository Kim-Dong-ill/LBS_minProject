import React from 'react'
import '../css/MapRadiusLayer.css'
import location from '../assets/location_point.svg'

function RadiusLayer({isLoading}) {
  return (
  <div>
    <img 
        className='location_point' 
        src={location} 
        alt="location" 
        style={{ display: isLoading ? 'block' : 'none' }}
    />
  </div>
  )
}

export default RadiusLayer
