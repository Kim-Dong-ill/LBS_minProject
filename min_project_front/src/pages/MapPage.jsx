import React, { useState } from 'react'
import Map from '../components/Map'
import RadiusLayer from '../components/RadiusLayer'
import '../css/mapPage.css'
import Button from '../components/Button'

function MapPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const buttonText = "주변 건물 조회"
    const handleClick = () => {
        setIsClicked(!isClicked)
      }
  return (
    <div className='map_page'>
      <Map  setIsLoading={setIsLoading} isClicked={isClicked}/>
      <RadiusLayer isLoading={isLoading}/>
      <Button onClick={handleClick}>{buttonText}</Button>
    </div>
  )
}

export default MapPage
