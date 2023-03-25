import * as pg from "pg";
import { createUserTbl } from "./user";
import { createEtcObjectTbl } from "./etcobject";
import { createEtcObjectVoteTbl } from "./etcobjectvote";

import dotenv from "dotenv"
dotenv.config();

const { Pool } = pg.default;

let dbUsername = "postgres";
let dbPassword = "password";
let dbName = "etcmap";
let dbHost = "localhost";
let dbPort = "5432";

if (process.env.DBUSERNAME)
    dbUsername = process.env.DBUSERNAME.toString();
if (process.env.DBPASSWORD)
    dbPassword = process.env.DBPASSWORD.toString();
if (process.env.DBNAME)
    dbName = process.env.DBNAME.toString();
if (process.env.DBHOST)
    dbHost = process.env.DBHOST.toString();
if (process.env.DBPORT)
    dbPort = process.env.DBPORT.toString();

const pool = new Pool({
    user: dbUsername,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: dbName,
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