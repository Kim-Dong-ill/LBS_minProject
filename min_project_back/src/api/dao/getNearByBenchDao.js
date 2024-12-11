import { db, schema } from "../../config/dbConfig.js";

const getNearbyBenchsDao = async (longitude, latitude, radius) => {
    const query = `
         SELECT 
            id,
            name,
            "longitude-X" AS longitude,
            "latitude-Y" AS latitude,
            ST_asText(geom) as rp_geom
        FROM ${schema}.rp_place
        WHERE ST_Distance(
            ST_Centroid(geom)::geography,
            ST_MakePoint($1, $2)::geography
        ) <= $3
    `;
    try {
        const result = await db.query(query, [longitude, latitude, radius]);
        return result.rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    getNearbyBenchsDao
};
