import { Router } from "express";
import { selectEtcObjects, insertEtcObject } from "../db";
import { getDecodedToken } from "./user";

export const objectRouter = Router();

objectRouter.get("/api/objects", (req, res) => {
    const mapType = req.query.map_type;
    selectEtcObjects(
        mapType,
        (data) => { res.json(data.rows); },
        () => { res.json({ success: false }); }
    );
});

objectRouter.post("/api/objects", async (req, res) => {
    const data = req.body;
    const decodedToken = getDecodedToken(req);
    if (!decodedToken.userId)
        res.status(403).send("Unauthorised");

    insertEtcObject(
        decodedToken.userId,
        data,
        (approved) => { res.json({ success: true, etcObject: data, approved: approved }); },
        () => { res.json({ success: false }); }
    );
});