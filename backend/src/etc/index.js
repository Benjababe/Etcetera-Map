import fs from "node:fs";

export const IMAGE_FOLDER = "images";

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
    console.log(`${req.method} ${req.originalUrl}`);
    next();
};