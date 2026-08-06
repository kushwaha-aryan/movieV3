import mongodb from "mongodb";
const ObjectId=mongodb.ObjectId;

let users

export default class usersDAO {

    static async injectDB(conn) {
        if(users){
            return
        }
        try {
            users=await conn.db("moviev3").collection("users");
        }catch (e){
            console.error(`unable to establish connection handels in userDAO : ${e}`);
        }
    }

    static async addUser(userId,password) {
        try {
            const userDoc={
                userId:userId,
                password:password
            }
            return await users.insertOne(userDoc);
        }catch (e){
            console.error(`unable to create user${e}`);
            return {error : e};
        }
    }


}


