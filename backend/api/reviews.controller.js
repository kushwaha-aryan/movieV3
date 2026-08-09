import ReviewsDAO from "../dao/reviewsDAO.js"

export default class ReviewsController {
    static async apiPostReview(req, res, next) {
        try {
            const movieId = parseInt(req.body.movieId)
            const review = req.body.review
            const userId = req.userId
            const user = req.username

            const reviewResponse = await ReviewsDAO.addReview(
                movieId,
                userId,
                user,
                review
            )
            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetReview(req, res, next) {
        try {
            let id = req.params.id || {}
            let review = await ReviewsDAO.getReview(id)
            if (!review) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(review)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }

    static async apiUpdateReview(req, res, next) {
        try {
            const reviewId = req.params.id
            const review = req.body.review
            const userId = req.userId

            const reviewResponse = await ReviewsDAO.updateReview(
                reviewId,
                userId,
                review
            )

            var { error } = reviewResponse
            if (error) {
                res.status(400).json({ error })
                return;
            }

            if (reviewResponse.modifiedCount === 0) {
                res.status(403).json({ error: "not authorized to edit this review" })
                return;
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiDeleteReview(req, res, next) {
        try {
            const reviewId = req.params.id
            const userId = req.userId
            const reviewResponse = await ReviewsDAO.deleteReview(reviewId, userId)

            if (reviewResponse.deletedCount === 0) {
                res.status(403).json({ error: "not authorized to delete this review" })
                return;
            }

            res.json({ status: "success" })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    }

    static async apiGetReviews(req, res, next) {
        try {
            let id = req.params.id || {}
            let reviews = await ReviewsDAO.getReviewsByMovieId(id)
            if (!reviews) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(reviews)
        } catch (e) {
            console.log(`api, ${e}`)
            res.status(500).json({ error: e })
        }
    }
}