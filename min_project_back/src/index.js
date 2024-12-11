import express from 'express';
import cors from 'cors';
import mountRoutes from './routers/router.js';

const app = express();

app.use(cors());
app.use(express.json());

mountRoutes(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});