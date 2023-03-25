import { runQuery } from "./db";

export const createEtcObjectVoteTbl = async () => {
    const objectDDL = `
        CREATE TABLE IF NOT EXISTS "etc_object_vote" (
            etc_object_id INT NOT NULL,
            user_id INT REFERENCES "user"(user_id),
            created_dt TIMESTAMP DEFAULT NOW(),
            vote_val INT NOT NULL DEFAULT 0,
            PRIMARY KEY ("etc_object_id", "user_id")
        );`;
    await runQuery(objectDDL, []);
}


/**
 * 
 * @param {number} etcObjectId Id of etc object that was voted on
 * @param {number} userId Id of the user who voted
 * @param {number} voteVal Value of the vote. 1 for positive, -1 for negative.
 * @param {*} onSuccess callback function for successful insert
 * @param {*} onError callback function for unsuccessful insert
 */
export const insertEtcObjectVote = (etcObjectId, userId, voteVal, onSuccess, onError) => {
    const query = `
        INSERT INTO \"etc_object_vote\" (etc_object_id, user_id, vote_val) 
        VALUES ($1, $2, $3)
        ON CONFLICT (etc_object_id, user_id) DO UPDATE SET
            vote_val=$3`;
    const values = [
        etcObjectId,
        userId,
        voteVal
    ];

    runQuery(query, values, onSuccess, onError);
};