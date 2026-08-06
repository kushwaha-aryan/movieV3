import mongodb from "mongodb";
const ObjectId=mongodb.ObjectId;

let reviews

export default class ReviewsDAO {

    static async injectDB(conn) {
        if(reviews){
            return
        }
        try {
            reviews=await conn.db("moviev3").collection("reviews");
        }catch (e){
            console.error(`unable to establish connection handels in userDAO : ${e}`);
        }
    }

    static async addReview(movieId,user,review) {
        try {
            const reviewDoc={
                movieId:movieId,
                user:user,
                review:review
            }
            return await reviews.insertOne(reviewDoc);
        }catch (e){
            console.error(`unable to post review${e}`);
            return {error : e};
        }
    }

    static async getReview(reviewId) {
        try {
            return await reviews.findOne({ _id: new ObjectId(reviewId) })

        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return { error: e }
        }
    }

    static async updateReview(reviewId, user, review) {
        try {
            const updateResponse = await reviews.updateOne(
                {_id: new ObjectId(reviewId) },
                { $set: { user: user, review: review } }
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e };
        }
    }

    static async deleteReview(reviewId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }

    static async getReviewsByMovieId(movieId) {
        console.log("mov", movieId)
        try {
            const cursor = await reviews.find({ movieId: parseInt(movieId) })
            return cursor.toArray()
        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return {error: e}
        }
    }
}


/*
Teacher (Linux/Mac):
curl -X POST URL -H "Content-Type: application/json" -d '{"key": "value"}'

You (Windows PowerShell):
Invoke-WebRequest -Uri URL -Method POST -Headers @{"Content-Type"="application/json"} -Body '{"key": "value"}'

in gitBash instead of Local
curl -X POST http://localhost:8000/api/v1/reviews/new -H "Content-Type: application/json" -d '{"movieId": 12, "user": "quincy", "review": "bad movie"}'
*/

/*
curl -X POST http://localhost:8000/api/v1/reviews/new -H "Content-Type: application/json" -d '{"movieId": 717724, "user": "quincy", "review": "bad movie"}'

curl -X GET http://localhost:8000/api/v1/reviews/69c729c844f723b002257ed9

curl -X PUT http://localhost:8000/api/v1/reviews/69c729c844f723b002257ed9 -H "Content-Type: application/json" -d '{"user": "quincy" , "review": "not so bad movie"}'

curl -X DELETE http://localhost:8000/api/v1/reviews/69c729d944f723b002257eda
 */