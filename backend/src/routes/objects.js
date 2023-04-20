import { Router } from "express";
import multer from "multer";
import { selectEtcObjects, insertEtcObject, deleteEtcObject, insertEtcObjectBulk } from "../db";
import { getDecodedToken } from "./user";
import { runEtcReputation, IMAGE_FOLDER } from "../etc";

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
    let etcObject = req.body;
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
    const trusted = await runEtcReputation(userId);

    try {
        const data = await insertEtcObject(userId, trusted, etcObject, images);
        res.json({ success: true, etcObjectId: data["etc_object_id"], approved: trusted });
    } catch (err) {
        res.json({ success: false, error: err.detail });
    }
});

// user adding several Etc objects at once
objectRouter.post("/api/objects/bulk", async (req, res) => {
    const { mapType, etcObjects } = req.body;

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
    const trusted = await runEtcReputation(userId);

    try {
        const data = await insertEtcObjectBulk(userId, trusted, mapType, etcObjects);
        res.json({ success: true, etcObjects: data, approved: trusted });
    } catch (err) {
        res.json({ success: false, error: err.detail });
    }

    res.status(500);
});


// user removing an Etc object
objectRouter.delete("/api/objects", async (req, res) => {
    const { etcObjectId } = req.body;
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

    try {
        const userId = decodedToken.userId;
        await deleteEtcObject(userId, etcObjectId);
        res.json({ success: true, etcObjectId: etcObjectId });
    } catch (err) {
        res.json({ success: false, error: err.detail });
    }
});