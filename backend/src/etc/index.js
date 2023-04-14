import fs from "node:fs";

export const IMAGE_FOLDER = "images";
export const HTTP_LOG_FILE = "httplog";

/**
 * 
 * Retrieves the user's trustworthy-ness
 * @param {number} userId 
 * @returns {boolean}
 */
export const runEtcRank = (userId) => {
    return false;
};

export const createImageFolder = () => {
    if (!fs.existsSync(IMAGE_FOLDER))
        fs.mkdirSync(IMAGE_FOLDER);
};

export const logMiddleware = (req, res, next) => {
    const logStr = `${req.connection.remoteAddress} ${req.method} ${req.originalUrl}`;
    console.log(logStr);
    fs.appendFile(HTTP_LOG_FILE, logStr + "\n", (err) => {
        if (err) throw err;
    });
    next();
};