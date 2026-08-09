import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {

    static async apiRegister(req, res, next) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                res.status(400).json({ error: "username, email, and password are required" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await UsersDAO.addUser(username, email, hashedPassword);

            if (result.error) {
                res.status(400).json({ error: result.error });
                return;
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiLogin(req, res, next) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).json({ error: "username and password are required" });
                return;
            }

            const user = await UsersDAO.getUserByUsername(username);

            if (!user) {
                res.status(401).json({ error: "invalid username or password" });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                res.status(401).json({ error: "invalid username or password" });
                return;
            }

            const token = jwt.sign(
                { userId: user._id, username: user.username },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({ status: "success", token: token, username: user.username });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}