import { pool } from "./db";
import bcrypt from "bcrypt";

const saltRounds = 10;

export const createUserTbl = async () => {
    const userDDL = `
        CREATE TABLE IF NOT EXISTS "user" (
            user_id INT GENERATED ALWAYS AS IDENTITY,
            username VARCHAR(20) NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            PRIMARY KEY ("user_id")
        );`;
    await pool.query(userDDL, []);
}


/**
 * 
 * @param {String} username 
 * @param {String} pwHash 
 */
export const register = async (username, pwHash, salt) => {
    const query = "INSERT INTO \"user\" (username, password_hash, salt) VALUES ($1, $2, $3)";
    const values = [username.trim(), pwHash, salt];

    const data = await pool.query(query, values);
    return data;
};

/**
 * 
 * Used for logging in, fetches the password hash and salt to be compared
 * @param {String} username 
 * @param {String} password 
 */
export const getUserCredentials = async (username) => {
    const query = "SELECT user_id, password_hash, salt FROM \"user\" WHERE username=$1 LIMIT 1";
    const values = [username.trim()];

    const data = await pool.query(query, values);
    return data;
};