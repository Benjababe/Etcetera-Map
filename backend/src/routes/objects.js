import { Router } from "express";
import { selectEtcObjects, insertEtcObject } from "../db";
import { getDecodedToken } from "./user";
import { runEtcRank } from "../etc";

export const objectRouter = Router();

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
objectRouter.post("/api/objects", async (req, res) => {
    const etcObject = req.body;
    const decodedToken = getDecodedToken(req);
    if (!decodedToken.userId)
        res.status(403).send("Unauthorised");

    const userId = decodedToken.userId;
    const trusted = runEtcRank(userId);

    try {
        const data = await insertEtcObject(userId, trusted, etcObject);
        res.json({ success: true, etcObject: data, approved: trusted });
    } catch (e) {
        res.json({ success: false });
    }
});