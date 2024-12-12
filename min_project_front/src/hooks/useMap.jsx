import mapboxgl from 'mapbox-gl'
import ReactDOM from 'react-dom/client';
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import {useEffect, useState} from 'react'
import axios from 'axios'
import benchIcon from "../../public/like.png"
import initializeDirections from './initializeDirections'
import BuildingPopup from '../components/BuildingPopup'
import BenchPopup from '../components/BenchPopup'
import '../css/mapBoxCustom.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

function useMap(mapContainerRef , style , config , setIsLoading,isClicked) {
    //const [isClicked, setIsClicked] = useState(false)
    const [center , setCenter] = useState(config.initialCenter);
    const [map, setMap] = useState(null);
    const [isDest,setIsDest] = useState(false);
    const [isOrigin,setIsSetOrigin] = useState(false);   
    // 출발지와 도착지 좌표를 저장할 상태 추가
    const [originCoords, setOriginCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);
    const [currentPopup, setCurrentPopup] = useState(null); // 현재 팝업을 저장할 상태

    // 출발지와 도착지가 모두 설정되었을 때 네비게이션 초기화
    useEffect(() => {
        if (map && isDest && isOrigin && originCoords && destCoords) {

            // 열려있는 팝업 제거
            if (currentPopup) {
                currentPopup.remove();
                setCurrentPopup(null);
            }
            initializeDirections(map,originCoords,destCoords);
        }
    }, [isDest, isOrigin, map, originCoords, destCoords]);

    //지도 초기화
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style : style,
            center : config.initialCenter,
            zoom : config.initialZoom,
        })
        setMap(map)

        const language = new MapboxLanguage({
            defaultLanguage : config.defaultLanguage,
        })
        map.addControl(language); //언어팩 설정
        
        

        //벤치 아이콘 추가
        map.on('load', () => {
            map.loadImage(`${benchIcon}`, (error, image) => {
                if (error) throw error;
                map.addImage('bench-marker', image);
            });
            // fetchNearbyData(map, center);
        })
        // styleimagemissing 이벤트 리스너 추가
        map.on('styleimagemissing', (e) => {
            if (e.id === 'bench-marker') {
                map.loadImage(`${benchIcon}`, (error, image) => {
                    if (error) throw error;
                    map.addImage('bench-marker', image);
                });
            }
        });

        // 드래그 시작 이벤트 추가
        map.on('dragstart', () => {
            setIsLoading(true);
        });

           // 지도 이동 이벤트 리스너
        map.on('moveend', () => {
            handleMapMove(map)
        })


        // 건물 레이어 클릭 이벤트
        map.on('click', 'buildings-fill',(e) =>{
            if (!e.features.length) return;
  
            const feature = e.features[0];
            const centroidStr = feature.properties.centroid;
            console.log("해당 건물 좌표",centroidStr);
            
            const coordinates = centroidStr
                .replace('POINT(', '')
                .replace(')', '')
                .split(' ')
                .map(Number);  // [경도, 위도]

                const SetDest=(state)=>{                    
                    setIsDest(state);
                    if (state) setDestCoords(coordinates);
                }
                const SetOrigin=(state)=>{                    
                    setIsSetOrigin(state);
                    if (state) setOriginCoords(coordinates);
                }

            const popupContent = document.createElement('div');
            const root = ReactDOM.createRoot(popupContent);
            root.render(
                <BuildingPopup 
                    properties={feature.properties} 
                    coordinates={coordinates} 
                    SetDest={SetDest}
                    SetOrigin={SetOrigin}
                />
            );
            

            const popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupContent)
                .addTo(map);

            setCurrentPopup(popup);
        })
        
        
        //벤치 레이어 클릭 이벤트
        map.on('click', 'benches',(e) =>{
            if (!e.features.length) return;
            
            const feature = e.features[0];
            console.log("feature",feature);
            const coordinates = feature.geometry.coordinates.slice();
    
            const SetDest=(state)=>{                    
                setIsDest(state);
                if (state) setDestCoords(coordinates);
            }
            const SetOrigin=(state)=>{                    
                setIsSetOrigin(state);
                if (state) setOriginCoords(coordinates);
            }

            const popupContent = document.createElement('div');
            const root = ReactDOM.createRoot(popupContent);
            root.render(
                <BenchPopup 
                    properties={feature.properties} 
                    coordinates={coordinates} 
                    SetDest={SetDest}
                    SetOrigin={SetOrigin}
                />
            );
    
            const popup = new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setDOMContent(popupContent)
                .addTo(map);

            setCurrentPopup(popup);
        })
        
        return () => map.remove();
       
    },[mapContainerRef , style , config])
    //반경 200m 내 빌딩 데이터 가져오기 버튼
    useEffect(()=>{
        if(map && center){
            fetchNearbyData(map, center);
        }
    },[isClicked])

    // 지도 이동 핸들러
    const handleMapMove = (map) => {
        if(map){
            const newCenter = map.getCenter();
            setCenter({ lng: newCenter.lng, lat: newCenter.lat });
            console.log("지도이동 newCenter",newCenter);
            // fetchNearbyData(map, { lng: newCenter.lng, lat: newCenter.lat });
        }
    };

    //주변 bidg data 가져오기 axios
    const fetchNearbyData = async (map, center) => {
        try {
            console.log("fetchNearbyData 실행");
            setIsLoading(true);

            //주변 건물&벤치 조회 axios
            const [responseBldg,responseBench] = await Promise.all([
                axios.get('http://localhost:3000/nearby-bldg', {
                    params: {
                            longitude: center.lng,
                            latitude: center.lat,
                            radius: 300  // 반경m (미터 단위)
                    }
                }),
                axios.get('http://localhost:3000/nearby-bench', {
                    params: {
                            longitude: center.lng,
                            latitude: center.lat,
                            radius: 300  // 반경m (미터 단위)
                    }
                })
            ])

            const buildings = responseBldg.data.data;
            const benches = responseBench.data.data;
            console.log("buildings",buildings);
            console.log("bench",benches);
            
               // GeoJSON FeatureCollection 생성 for benches
            const benchesGeojsonData = {
                type: 'FeatureCollection',
                features: benches.map(bench => ({
                    type: 'Feature',
                    properties: {
                        id: bench.id,
                        name: bench.name
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [bench.longitude, bench.latitude]
                    }
                }))
            };

             // GeoJSON FeatureCollection 생성 for bldg
            const geojsonData = {
                type: 'FeatureCollection',
                name: 'bldg_polygon',
                crs: {
                    type: 'name',
                    properties: {
                        name: 'urn:ogc:def:crs:OGC:1.3:CRS84'
                    }
                },
                features: buildings.map(building => ({
                    type: 'Feature',
                    properties: {
                        bldg_id: building.bldg_id,
                        bldg_nm: building.bldg_nm,
                        road_nm_addr: building.road_nm_addr,
                        lotno_addr: building.lotno_addr,
                        distance: building.distance,
                        centroid: building.centroid 
                    },
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: parseWKTPolygon(building.bldg_geom)
                    }
                }))
            };
            
            // 기존 레이어와 소스가 있다면 제거
            if (map.getLayer('buildings-fill')) map.removeLayer('buildings-fill');
            if (map.getLayer('buildings-outline')) map.removeLayer('buildings-outline');
            if (map.getSource('buildings')) map.removeSource('buildings');
            // 기존 벤치 레이어와 소스가 있다면 제거
            if (map.getLayer('benches')) map.removeLayer('benches');
            if (map.getSource('benches')) map.removeSource('benches');
            
            
            // 새로운 빌딩 소스와 레이어 추가
            map.addSource('buildings', {
                type: 'geojson',
                data: geojsonData
            });

            // 폴리곤 채우기 레이어
            map.addLayer({
                id: 'buildings-fill',
                type: 'fill',
                source: 'buildings',
                paint: {
                    'fill-color': '#0080ff',
                    'fill-opacity': 0.4
                }
            });

            // 폴리곤 외곽선 레이어
            map.addLayer({
                id: 'buildings-outline',
                type: 'line',
                source: 'buildings',
                paint: {
                    'line-color': '#000',
                    'line-width': 1
                }
            });

            // 새로운 벤치 소스와 레이어 추가
            map.addSource('benches', {
                type: 'geojson',
                data: benchesGeojsonData
            });

            map.addLayer({
                id: 'benches',
                type: 'symbol',
                source: 'benches',
                layout: {
                    'icon-image': 'bench-marker',  // 위에서 추가한 이미지 이름
                    'icon-size': 0.7,  // 아이콘 크기 조절
                    'icon-allow-overlap': true  // 마커 겹침 허용
                }
            });

            setIsLoading(false); // 데이터 로딩 완료

        } catch (error) {
            console.error('근처 데이터 가져오기 실패:', error);
        }
    }

    // WKT를 GeoJSON coordinates로 변환하는 함수
    function parseWKTPolygon(wkt) {
        const coordinatesString = wkt.replace("MULTIPOLYGON(((", "").replace(")))", "");
        const coordinatesPairs = coordinatesString.split(",");
        const coordinates = coordinatesPairs.map(pair => {
            const [lon, lat] = pair.trim().split(" ").map(Number);
            return [lon, lat];
        });
        return [[coordinates]]; // MultiPolygon 형식에 맞게 배열 중첩
    }


  return (
    <div>
    </div>
  )
}


export default useMap
