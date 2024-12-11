import { db, schema } from "../../config/dbConfig.js";

const placesDao = async (longitude, latitude, radius) => {
    // console.log(longitude, latitude, radius);
const query = `
    SELECT 
    bldg_id,
    bldg_sn,
    rds_sn,
    sig_cd,
    emd_cd,
    lotno_addr,
    road_nm_addr,
    bldg_nm,
    crt_dt,
	ST_asText(bldg_geom) as bldg_geom,
    ST_AsText(ST_Centroid(bldg_geom)) AS centroid,
    ST_Distance(
        ST_Centroid(bldg_geom)::geography,
        ST_MakePoint($1, $2)::geography
    ) AS distance
FROM 
${schema}.bldg
WHERE 
    ST_Distance(
        ST_Centroid(bldg_geom)::geography,
        ST_MakePoint($1, $2)::geography
    ) <= $3`;
    
    try {
        const result = await db.query(query, [longitude, latitude, radius]);
        // console.log(result.rows);
        return result.rows;
        
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default {
    placesDao
}
