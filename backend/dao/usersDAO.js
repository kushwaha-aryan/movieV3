import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let users

export default class UsersDAO {

    static async injectDB(conn) {
        if (users) {
            return
        }
        try {
            users = await conn.db("moviev3").collection("users");
            await users.createIndex({ username: 1 }, { unique: true });
            await users.createIndex({ email: 1 }, { unique: true });
        } catch (e) {
            console.error(`unable to establish connection handles in usersDAO: ${e}`);
        }
    }

    static async addUser(username, email, hashedPassword) {
        try {
            const userDoc = {
                username: username,
                email: email,
                password: hashedPassword
            }
            return await users.insertOne(userDoc);
        } catch (e) {
            if (e.code === 11000) {
                return { error: "username or email already exists" };
            }
            console.error(`unable to create user: ${e}`);
            return { error: e };
        }
    }

    static async getUserByUsername(username) {
        try {
            return await users.findOne({ username: username });
        } catch (e) {
            console.error(`unable to get user: ${e}`);
            return { error: e };
        }
    }

    static async getUserById(userId) {
        try {
            return await users.findOne({ _id: new ObjectId(userId) });
        } catch (e) {
            console.error(`unable to get user: ${e}`);
            return { error: e };
        }
    }
}