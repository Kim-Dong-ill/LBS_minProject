import {useRef} from 'react'
import { mapConfig } from '../config/mapConfig'
import useMap from '../hooks/useMap'

function Map({setIsLoading,isClicked}) {
    const mapContainerRef = useRef(null)
    
    useMap(mapContainerRef, mapConfig.defaultStyle, mapConfig, setIsLoading,isClicked)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <div ref={mapContainerRef} style={{width: '100%', height: '100vh'}}/>
    </div>
  )
}

export default Map
