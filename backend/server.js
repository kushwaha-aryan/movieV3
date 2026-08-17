import express from 'express'
import cors from "cors"
import review from "./api/reviews.route.js"
import movies from "./api/movie.route.js"
import users from "./api/users.route.js"
import savedMovies from "./api/savedMovies.route.js"
import recommend from "./api/recommend.route.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/reviews", review);
app.use("/api/v1/movies", movies);
app.use("/api/v1/users", users);
app.use("/api/v1/saved", savedMovies);
app.use("/api/v1/recommend", recommend);
app.use("*splat",(req,res,next)=>
    res.status(404).json({error : "Not Found"}))

export default app;