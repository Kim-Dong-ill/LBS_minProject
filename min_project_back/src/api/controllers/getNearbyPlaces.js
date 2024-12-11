import placesDao from "../dao/getNearByPlacesDao.js";
import benchDao from "../dao/getNearByBenchDao.js";

// 건물 조회
const getNearbyPlaces = async (req, res) => {
    try {
        // console.log(req.query);
        const { longitude, latitude, radius } = req.query;
        
        //dao 호출
        const result = await placesDao.placesDao(longitude, latitude, radius);
        
        // 응답 추가
        res.json({ message: "데이터 수신 성공", data: result });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
}

// 벤치 조회
const getNearbyBenchs = async (req, res) => {
    try {
        console.log(req.query);
        
        const { longitude, latitude, radius } = req.query;
        const result = await benchDao.getNearbyBenchsDao(longitude, latitude, radius);
        res.json({ message: "데이터 수신 성공", data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "서버 오류", error: error.message });
    }
}

export default {
    getNearbyPlaces,
    getNearbyBenchs
}
