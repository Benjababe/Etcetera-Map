import { pool } from "./db";

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
        SELECT etc_object_id AS "id", name, type, lat, lng, level, comments
        FROM "etc_object"
        WHERE type=$1
            AND status=1`;
    const data = await pool.query(query, [mapType]);
    return data;
};


/**
 * 
 * @param {number} userId Id of user who submitted the etc object
 * @param {boolean} trusted Flag whether user is trusted from EtcRank algorithm
 * @param {Object} etcObject Etc object to insert into map
 */
export const insertEtcObject = async (userId, trusted, etcObject) => {
    const status = (trusted) ? 1 : 0;
    const query = `
        INSERT INTO \"etc_object\" (user_id, type, lat, lng, level, comments, status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    const values = [
        userId,
        etcObject.type,
        etcObject.lat,
        etcObject.lng,
        etcObject.level,
        etcObject.comments,
        status
    ];

    const data = await pool.query(query, values);
    return data;
};