import express from 'express';
import ctrl from '../api/controllers/getNearbyPlaces.js';

const bldgRouter = express.Router();

bldgRouter.get("/", ctrl.getNearbyPlaces);

export default bldgRouter;
