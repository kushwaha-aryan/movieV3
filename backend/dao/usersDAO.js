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

    static async incrementRecommendCount(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const user = await users.findOne({ _id: new ObjectId(userId) });

            if (user.recommendDate !== today) {
                await users.updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: { recommendDate: today, recommendCount: 1 } }
                );
                return 1;
            } else {
                const newCount = (user.recommendCount || 0) + 1;
                await users.updateOne(
                    { _id: new ObjectId(userId) },
                    { $set: { recommendCount: newCount } }
                );
                return newCount;
            }
        } catch (e) {
            console.error(`unable to increment recommend count: ${e}`);
            return null;
        }
    }

    static async getRecommendCount(userId) {
        try {
            const today = new Date().toISOString().split('T')[0];
            const user = await users.findOne({ _id: new ObjectId(userId) });
            if (user.recommendDate !== today) {
                return 0;
            }
            return user.recommendCount || 0;
        } catch (e) {
            console.error(`unable to get recommend count: ${e}`);
            return 0;
        }
    }
}

