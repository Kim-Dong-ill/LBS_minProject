import mapboxgl from 'mapbox-gl'
import MapboxDir from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
let directionsInstance = null; // directions 인스턴스를 전역으로 관리
// let destData = null;
// let originData = null;

function initializeDirections(map,originCoords,destCoords) {

  // Directions 플러그인 추가
  const directions = new MapboxDir({
      accessToken: mapboxgl.accessToken,
      unit: 'metric', // 거리 단위 (metric: 미터, imperial: 마일)
      profile: 'mapbox/walking', // 길찾기 모드 (driving, walking, cycling 등)
      language: 'ko',  // 한글 설정 추가
      steps: true,
      controls: {
          inputs: true,
          instructions: true,
          profileSwitcher: true  // 이동수단 선택 옵션 활성화
      },
      placeholderOrigin: "출발지를 입력하세요",
      placeholderDestination: "도착지를 입력하세요",
      zoom: 16
  });

  // Directions 컨트롤 추가
  map.addControl(directions, 'top-left');
  directionsInstance = directions; // 인스턴스 저장

  // 프로필 이름 변경을 위한 DOM 조작
   // DOM이 로드된 후 텍스트 변경
  setTimeout(() => {
      const originInput = document.querySelector('.mapbox-directions-origin input');
      const destinationInput = document.querySelector('.mapbox-directions-destination input');
      
      if (originInput) {
          originInput.placeholder = "출발지를 입력하세요";
      }
      if (destinationInput) {
          destinationInput.placeholder = "도착지를 입력하세요";
      }

      // 프로필 라벨 변경
      const profiles = {
        'mapbox-directions-profile-traffic': '운전',
        'mapbox-directions-profile-driving': '운전',
          'mapbox-directions-profile-walking': '도보',
          'mapbox-directions-profile-cycling': '자전거'
      };

      Object.entries(profiles).forEach(([id, text]) => {
          const label = document.querySelector(`label[for="${id}"]`);
          if (label) {
              label.textContent = text;
          }
      });
  }, 1000);
  
  // 출발지와 도착지 설정
  directions.setOrigin(originCoords);
  directions.setDestination(destCoords);
}
// directions 인스턴스에 접근하기 위한 함수들
export const setOriginPoint = (coordinates) => {
    console.log("출발지",coordinates);
    if (directionsInstance) {
        directionsInstance.setOrigin(coordinates);
        originData = coordinates;
    }
};

export const setDestinationPoint = (coordinates) => {
    console.log("도착지",coordinates);
    if (directionsInstance) {
        directionsInstance.setDestination(coordinates);
        destData = coordinates;
    }
};

export default initializeDirections
