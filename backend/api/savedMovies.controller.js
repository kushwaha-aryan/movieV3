import SavedMoviesDAO from "../dao/savedMoviesDAO.js";

export default class SavedMoviesController {

    static async apiAddSavedMovie(req, res, next) {
        try {
            const userId = req.userId;
            const { movieId, movieTitle, posterPath, type } = req.body;

            if (!movieId || !type) {
                res.status(400).json({ error: "movieId and type are required" });
                return;
            }

            const result = await SavedMoviesDAO.addSavedMovie(userId, movieId, movieTitle, posterPath, type);

            if (result.error) {
                res.status(400).json({ error: result.error });
                return;
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiRemoveSavedMovie(req, res, next) {
        try {
            const userId = req.userId;
            const movieId = req.params.movieId;
            const type = req.query.type;

            const result = await SavedMoviesDAO.removeSavedMovie(userId, movieId, type);

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetSavedMovies(req, res, next) {
        try {
            const userId = req.userId;
            const type = req.params.type;

            const movies = await SavedMoviesDAO.getSavedMovies(userId, type);

            res.json(movies);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
}