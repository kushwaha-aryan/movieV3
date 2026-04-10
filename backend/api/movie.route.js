import express from "express";

const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const API_KEY = process.env.TMDB_API_KEY;
        const page = req.query.page || 1;
        const sort = req.query.sort || 'revenue.desc';
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=${sort}&api_key=${API_KEY}&page=${page}&vote_count.gte=100`);
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/search", async (req, res) => {
    try{
        const API_KEY = process.env.TMDB_API_KEY;
        const query = req.query.q;
        const page = req.query.page || 1;
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=${page}`);
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/genre/:id", async (req, res) => {
    try{
        const API_KEY = process.env.TMDB_API_KEY;
        const page = req.query.page || 1;
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?sort_by=revenue.desc&api_key=${API_KEY}&page=${page}&with_genres=${req.params.id}&vote_count.gte=100`);
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const API_KEY = process.env.TMDB_API_KEY;
        const response = await fetch(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${API_KEY}`);
        const data = await response.json();
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;