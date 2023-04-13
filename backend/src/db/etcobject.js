import { pool } from "./db";
import { insertEtcObjectImage } from "./etcobjectimage";

export const createEtcObjectTbl = async () => {
    const objectDDL = `
        CREATE TABLE IF NOT EXISTS "etc_object" (
            etc_object_id INT GENERATED ALWAYS AS IDENTITY,
            created_dt TIMESTAMP DEFAULT NOW(),
            user_id INT REFERENCES "user"(user_id),
            name VARCHAR(100) NOT NULL DEFAULT '',
            type VARCHAR(100) NOT NULL,
            lat DOUBLE PRECISION NOT NULL,
            lng DOUBLE PRECISION NOT NULL,
            level VARCHAR(100) NOT NULL,
            comments TEXT,
            status INT NOT NULL DEFAULT 0,
            PRIMARY KEY ("etc_object_id")
        );`;
    await pool.query(objectDDL, []);
}

/**
 * Retrieves all Etc Objects of a map type and are approved
 * @param {string} mapType 
 * @returns 
 */
export const selectEtcObjects = async (mapType) => {
    const query = `
        SELECT eo.etc_object_id AS "id", eo.name, eo.type, 
            eo.lat, eo.lng, eo.level, eo.comments,
            COALESCE(
                array_agg(eoi.path)
                FILTER (WHERE eoi.path IS NOT NULL),
                '{}'
            ) AS paths
        FROM "etc_object" AS eo
        LEFT JOIN "etc_object_image" AS eoi ON eoi.etc_object_id=eo.etc_object_id
        WHERE type=$1
            AND status=1
        GROUP BY eo.etc_object_id
    `;
    const data = await pool.query(query, [mapType]);
    return data;
};


/**
 * 
 * @param {number} userId Id of user who submitted the etc object
 * @param {boolean} trusted Flag whether user is trusted from EtcRank algorithm
 * @param {Object} etcObject Etc object to insert into map
 * @param {Express.Multer.File[]} images Images uploaded with the Etc object
 */
export const insertEtcObject = async (userId, trusted, etcObject, images) => {
    const status = (trusted) ? 1 : 0;
    const query = `
        INSERT INTO \"etc_object\" (user_id, type, lat, lng, level, comments, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING etc_object_id`;
    const values = [
        userId,
        etcObject.type,
        etcObject.lat,
        etcObject.lng,
        etcObject.level,
        etcObject.comments,
        status
    ];

    const { rows } = await pool.query(query, values);

    const insertedId = rows[0]["etc_object_id"];
    images.forEach((image) => {
        insertEtcObjectImage(insertedId, image);
    });

    return rows;
};