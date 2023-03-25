import * as pg from "pg";
import { createUserTbl } from "./user";
import { createEtcObjectTbl } from "./etcobject";
import { createEtcObjectVoteTbl } from "./etcobjectvote";

const { Pool } = pg.default;

let dbusername = "postgres";
let dbpassword = "password";
let dbname = "etcmap";

if (process.env.DBUSERNAME && process.env.DBPASSWORD && process.env.DBNAME) {
    dbusername = process.env.DBUSERNAME.toString();
    dbpassword = process.env.DBPASSWORD.toString();
    dbname = process.env.DBNAME.toString();
}

const pool = new Pool({
    user: dbusername,
    password: dbpassword,
    host: "localhost",
    port: 5432,
    database: dbname,
});

/**
 * 
 * @param {String} query Query string
 * @param {Array<any>} values Values if using a prameterized query
 * @param {Function} onSuccess Callback function on successful query
 * @param {Function} onError Callback function on error
 */
export const runQuery = async (query, values, onSuccess = undefined, onError = undefined) => {
    return new Promise((resolve) => {
        pool.query(query, values, (err, result) => {
            if (err && onError != undefined) {
                onError(err);
            } else if (onSuccess != undefined) {
                onSuccess(result);
            }
            resolve();
        });
    });

};

/**
 * Initialises database with schemas if they don't already exist
 */
export const initDB = async () => {
    await createUserTbl();
    await createEtcObjectTbl();
    await createEtcObjectVoteTbl();
};