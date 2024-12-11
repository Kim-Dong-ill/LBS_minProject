import express from 'express';
import ctrl from '../api/controllers/getNearbyPlaces.js';

const benchRouter = express.Router();

benchRouter.get("/", ctrl.getNearbyBenchs);

export default benchRouter;


