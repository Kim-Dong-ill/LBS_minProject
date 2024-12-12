import express from 'express';
import cors from 'cors';
import mountRoutes from './routers/router.js';


const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

mountRoutes(app);

app.listen(port, () => {
    console.log('Server is running on port 3000');
});