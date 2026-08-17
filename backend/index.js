import dotenv from 'dotenv'
dotenv.config()

import app from './server.js';
import mongodb from "mongodb"
import ReviewsDAO from "./dao/reviewsDAO.js"
import UsersDAO from "./dao/usersDAO.js"
import SavedMoviesDAO from "./dao/savedMoviesDAO.js"

const MongoClient = mongodb.MongoClient;
const mongo_username=process.env['MONGODB_USERNAME'];
const mongo_password=process.env['MONGODB_PASSWORD'];
const uri=`mongodb://${mongo_username}:${mongo_password}@ac-ttpoihu-shard-00-00.fpigit status   bdjk.mongodb.net:27017,ac-ttpoihu-shard-00-01.fpibdjk.mongodb.net:27017,ac-ttpoihu-shard-00-02.fpibdjk.mongodb.net:27017/?ssl=true&replicaSet=atlas-pqndx9-shard-0&authSource=admin&appName=MovieReviews&retryWrites=true&w=majority`

const port=8000

MongoClient.connect(
    uri,
    {
        maxPoolSize:50,
        wtimeoutMS:2500,
    }
).catch(err => {
    console.error(err.stack)
    process.exit(1)
})
    .then(async client =>{
        await ReviewsDAO.injectDB(client)
        await UsersDAO.injectDB(client)
        await SavedMoviesDAO.injectDB(client)
        app.listen(port,()=>{
            console.log(`Listening on port ${port}`);
        })
    })