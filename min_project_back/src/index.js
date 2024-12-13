import express from 'express';
import cors from 'cors';
import mountRoutes from './routers/router.js';


const port = process.env.PORT || 8080;

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://react-dongill-mapbox-dot-winged-woods-442503-f1.du.r.appspot.com'
    ],
    credentials: true
}));
app.use(express.json());

mountRoutes(app);

app.listen(port, () => {
    console.log('Server is running on port 8080');
});