import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per window
    message: { error: "Too many login attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});