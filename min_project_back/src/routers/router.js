import bldgRouter from './bldgRouter.js';
import benchRouter from './benchRouter.js';

const mountRoutes = (app) => {
    app.use("/nearby-bldg", bldgRouter);
    app.use("/nearby-bench", benchRouter);
}

export default mountRoutes;
