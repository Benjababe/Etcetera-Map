import bcrypt from "bcrypt";
import { runQuery } from "./db";

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
    await runQuery(userDDL, []);
}


/**
 * 
 * @param {String}   username 
 * @param {String}   password 
 * @param {Function} onSuccess  Callback function for a successful registration
 * @param {Function} onError    Callback function for an unsuccessful registration
 */
export const register = (username, password, onSuccess, onError) => {
    bcrypt.genSalt(saltRounds, (err, salt) => {
        if (err) {
            onError(err);
            return;
        }

        bcrypt.hash(password.trim(), salt, (err, passwordHash) => {
            if (err) {
                onError(err);
                return;
            }

            const query = "INSERT INTO \"user\" (username, password_hash, salt) VALUES ($1, $2, $3)";
            const values = [username.trim(), passwordHash, salt];
            runQuery(query, values, onSuccess, onError);
        });
    });
};

/**
 * 
 * @param {String} username 
 * @param {String} password 
 * @param {Function} onSuccess callback function for successful login
 * @param {Function} onError   callback function for unsuccessful login
 */
export const login = (username, password, onSuccess, onError) => {
    const query = "SELECT user_id, password_hash, salt FROM \"user\" WHERE username=$1 LIMIT 1";
    const values = [username.trim()];

    runQuery(query, values, (result) => {
        if (result.rowCount == 0) {
            onError({ detail: "Incorrect username/password" });
            return;
        }

        const row = result.rows[0];
        const pwHash = row["password_hash"];

        bcrypt.compare(password.trim(), pwHash, (err, cmpRes) => {
            if (result === false)
                onError(err);
            else
                onSuccess(cmpRes, row["user_id"]);
        });
    }, onError);
};