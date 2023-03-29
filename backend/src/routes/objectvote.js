import { Router } from "express";
import { insertEtcObjectVote } from "../db";
import { getDecodedToken } from "./user";

export const objectVoteRouter = Router();

// user votes for an existing Etc object
objectVoteRouter.post("/api/objectVote", async (req, res) => {
    const { etcObjectId, voteVal } = req.body;
    const { userId } = getDecodedToken(req);
    if (!userId)
        res.status(403).send("Unauthorised");

    try {
        await insertEtcObjectVote(etcObjectId, userId, voteVal);
        res.json({ success: true, voteVal: voteVal });
    } catch (e) {
        res.json({ success: false });
    }
});