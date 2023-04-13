import { initDB, pool } from "./db";
import { register, getUserCredentials } from "./user";
import { selectEtcObjects, insertEtcObject } from "./etcobject";
import { insertEtcObjectVote } from "./etcobjectvote";
import { insertEtcObjectImage } from "./etcobjectimage";

export {
    initDB,
    pool,
    register,
    getUserCredentials as login,
    selectEtcObjects,
    insertEtcObject,
    insertEtcObjectVote,
    insertEtcObjectImage,
}