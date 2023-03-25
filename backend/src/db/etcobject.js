import { runQuery } from "./db";
import { runEtcRank } from "../etc";

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
    await runQuery(objectDDL, []);
}

export const selectEtcObjects = (mapType, onSuccess, onError) => {
    const query = `
        SELECT etc_object_id AS "id", name, type, lat, lng, level, comments
        FROM "etc_object"
        WHERE type=$1
            AND status=1`;
    runQuery(query, [mapType], onSuccess, onError);
};


/**
 * 
 * @param {number} userId Id of user who submitted the etc object
 * @param {Object} etcObject Etc object to insert into map
 * @param {Function} onSuccess callback function for successful insert
 * @param {Function} onError callback function for unsuccessful insert
 */
export const insertEtcObject = (userId, etcObject, onSuccess, onError) => {
    const trusted = runEtcRank(userId);
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

    runQuery(
        query,
        values,
        () => { onSuccess(trusted); },
        onError
    );
};