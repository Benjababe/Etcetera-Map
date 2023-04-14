import { Router } from "express";
import multer from "multer";
import { selectEtcObjects, insertEtcObject } from "../db";
import { getDecodedToken } from "./user";
import { runEtcRank, IMAGE_FOLDER } from "../etc";

export const objectRouter = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, IMAGE_FOLDER);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// retrieving Etc objects
objectRouter.get("/api/objects", async (req, res) => {
    const mapType = req.query.map_type;
    try {
        const data = await selectEtcObjects(mapType);
        res.json(data.rows);
    } catch (e) {
        res.json({ success: false });
    }
});

// user adding an Etc object
objectRouter.post("/api/objects", upload.array(IMAGE_FOLDER), async (req, res) => {
    const etcObject = req.body;
    const images = req.files;
    let decodedToken;

    try {
        decodedToken = getDecodedToken(req);
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            res.json({ success: false, error: "Session token has expired, please relogin" });
        }
    }

    if (!decodedToken.userId)
        res.status(403).send("Unauthorised");

    const userId = decodedToken.userId;
    const trusted = runEtcRank(userId);

    try {
        const data = await insertEtcObject(userId, trusted, etcObject, images);
        res.json({ success: true, etcObject: data, approved: trusted });
    } catch (e) {
        res.json({ success: false });
    }
});