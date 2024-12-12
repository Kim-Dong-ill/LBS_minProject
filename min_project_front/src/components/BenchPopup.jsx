import { setOriginPoint, setDestinationPoint } from '../hooks/initializeDirections';


const BenchPopup = ({ properties ,coordinates,SetDest,SetOrigin}) => {
    const handleSetOrigin = () => {
        setOriginPoint(coordinates);
        SetDest(true);
    };

    const handleSetDestination = () => {
        setDestinationPoint(coordinates);
        SetOrigin(true);
    };

    return (
        <div className="bench-popup">
            <h4>벤치 정보</h4>
            <p>벤치 ID: {properties.id}</p>
            <p>이름: {properties.name || '이름 없음'}</p>
            <div className="navigation-buttons">
                <button onClick={handleSetOrigin}>출발지로 설정</button>
                <button onClick={handleSetDestination}>도착지로 설정</button>
            </div>
        </div>
    );
};

export default BenchPopup;