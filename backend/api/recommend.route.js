import express from "express";
import auth from "../middleware/auth.js";
import SavedMoviesDAO from "../dao/savedMoviesDAO.js";
import UsersDAO from "../dao/usersDAO.js";

const router = express.Router();

const DAILY_LIMIT = 6;

router.route("/").get(auth, async (req, res) => {
    try {
        const userId = req.userId;

        const currentCount = await UsersDAO.getRecommendCount(userId);
        if (currentCount >= DAILY_LIMIT) {
            res.status(429).json({ error: `Daily limit reached (${DAILY_LIMIT}/day). Try again tomorrow.` });
            return;
        }

        const favorites = await SavedMoviesDAO.getSavedMovies(userId, "favorite");

        if (!favorites || favorites.length === 0) {
            res.status(400).json({ error: "Add some favorites first to get recommendations" });
            return;
        }

        const movieTitles = favorites.map(m => m.movieTitle).join(", ");
        const prompt = `I like these movies: ${movieTitles}. Recommend 10 similar movies and briefly explain why for each. Format as a numbered list.`;

        const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            }
        );

        const data = await geminiRes.json();
        const recommendation = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

        if (!recommendation) {
            res.status(500).json({ error: "AI service returned no recommendation. Please try again." });
            return;
        }

        const newCount = await UsersDAO.incrementRecommendCount(userId);
        res.json({ status: "success", recommendation, usageCount: newCount, dailyLimit: DAILY_LIMIT });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;