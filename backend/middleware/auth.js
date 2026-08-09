import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ error: "no token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.username = decoded.username;
        next();
    } catch (e) {
        res.status(401).json({ error: "invalid or expired token" });
    }
}