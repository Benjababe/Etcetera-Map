import { Router } from "express";
import { insertEtcObjectVote } from "../db";
import { getDecodedToken } from "./user";

export const objectVoteRouter = Router();

objectVoteRouter.post("/api/objectVote", async (req, res) => {
    const data = req.body;
    const decodedToken = getDecodedToken(req);
    if (!decodedToken.userId)
        res.status(403).send("Unauthorised");

    insertEtcObjectVote(
        data.etcObjectId,
        decodedToken.userId,
        data.voteVal,
        () => { res.json({ success: true }); },
        () => { res.json({ success: false }); }
    );
});