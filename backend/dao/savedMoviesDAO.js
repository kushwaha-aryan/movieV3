import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let savedMovies

export default class SavedMoviesDAO {

    static async injectDB(conn) {
        if (savedMovies) {
            return
        }
        try {
            savedMovies = await conn.db("moviev3").collection("savedMovies");
            await savedMovies.createIndex({ userId: 1, movieId: 1, type: 1 }, { unique: true });
        } catch (e) {
            console.error(`unable to establish connection handles in savedMoviesDAO: ${e}`);
        }
    }

    static async addSavedMovie(userId, movieId, movieTitle, posterPath, type) {
        try {
            const doc = {
                userId: userId,
                movieId: movieId,
                movieTitle: movieTitle,
                posterPath: posterPath,
                type: type
            }
            return await savedMovies.insertOne(doc);
        } catch (e) {
            if (e.code === 11000) {
                return { error: "already saved" };
            }
            console.error(`unable to save movie: ${e}`);
            return { error: e };
        }
    }

    static async removeSavedMovie(userId, movieId, type) {
        try {
            return await savedMovies.deleteOne({
                userId: userId,
                movieId: movieId,
                type: type
            });
        } catch (e) {
            console.error(`unable to remove movie: ${e}`);
            return { error: e };
        }
    }

    static async getSavedMovies(userId, type) {
        try {
            const cursor = await savedMovies.find({ userId: userId, type: type });
            return cursor.toArray();
        } catch (e) {
            console.error(`unable to get saved movies: ${e}`);
            return { error: e };
        }
    }
}