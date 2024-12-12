import React from 'react'
import { setOriginPoint, setDestinationPoint } from '../hooks/initializeDirections';

function BuildingPopup({properties,coordinates,SetDest,SetOrigin}) {
    const handleSetOrigin = () => {
        setOriginPoint(coordinates);
        SetDest(true);
    };

    const handleSetDestination = () => {
        setDestinationPoint(coordinates);
        SetOrigin(true);
    };

  return (
    <div className="building-popup">
        <h4>건물 정보</h4>
        <p>건물명: {properties.bldg_nm || '이름 없음'}</p>
        <p>도로명 주소: {properties.road_nm_addr}</p>
        <p>지번 주소: {properties.lotno_addr}</p>
        <p>거리: {Math.round(properties.distance)}m</p>
        <div className="navigation-buttons">
            <button onClick={handleSetOrigin}>출발지로 설정</button>
            <button onClick={handleSetDestination}>도착지로 설정</button>
        </div>
    </div>
  )
}

export default BuildingPopup
