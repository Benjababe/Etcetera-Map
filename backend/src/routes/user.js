import { Router } from "express";
import jwt from "jsonwebtoken";
import { register, login } from "../db";

export const userRouter = Router();

userRouter.post("/api/register", (req, res) => {
    const { username, password } = req.body;

    register(username, password,
        () => { res.json({ success: true }) },
        (err) => { res.json({ success: false, error: err }) });
});

userRouter.post("/api/login", (req, res) => {
    const { username, password } = req.body;

    const handleLogin = (cmp, userId = "") => {
        if (!cmp)
            res.status(403).json({ success: false, error: { details: "Incorrect username/password" } });
        else {
            const token = jwt.sign(
                { username: username, userId: userId },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "7d" }
            );

            const user = {
                username: username,
                authToken: token
            };

            res.cookie("jwtLogin", token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.cookie("username", username, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.json({ success: true, user: user });
        }
    }

    login(
        username,
        password,
        handleLogin,
        (err) => { res.status(403).json({ success: false, error: err }) }
    );
});


/**
 * 
 * @param {Request} req 
 * @returns {string}
 */
export const getDecodedToken = (req) => {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer "))
        return null;
    const token = authorization.replace("Bearer ", "");
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decodedToken
};