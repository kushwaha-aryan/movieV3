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

    static async addReview(movieId,userId,user,review) {
        try {
            const reviewDoc={
                movieId:movieId,
                userId:userId,
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

    static async updateReview(reviewId, userId, review) {
        try {
            const updateResponse = await reviews.updateOne(
                {_id: new ObjectId(reviewId), userId: userId },
                { $set: { review: review } }
            )

            return updateResponse
        } catch (e) {
            console.error(`Unable to update review: ${e}`)
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: new ObjectId(reviewId),
                userId: userId
            })

            return deleteResponse
        } catch (e) {
            console.error(`Unable to delete review: ${e}`)
            return { error: e }
        }
    }

    static async getReviewsByMovieId(movieId) {
        try {
            const cursor = await reviews.find({ movieId: parseInt(movieId) })
            return cursor.toArray()
        } catch (e) {
            console.error(`Unable to get review: ${e}`)
            return {error: e}
        }
    }
}

