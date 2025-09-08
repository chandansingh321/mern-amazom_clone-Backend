import jwt from "jsonwebtoken";  // Don't forget to import jwt if not already

export const authenticatMiddleware = (req, res, next) => {
    try {
        const JWT_SECRET = "addhafrabhhekh!%#";

        // 1. Get the token from Authorization header (format: "Bearer <token>")
        const token = req?.headers?.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Authorization token required"
            });
        }

        // 2. Verify the token (correct order: token, secret)
        const decoded = jwt.verify(token, JWT_SECRET);

        // 3. Attach decoded user data to request
        req.user = decoded;

        console.log(decoded,"decodeddecodeddecoded")

        // 4. Proceed to next middleware
        next();
    } catch (error) {
        console.error("JWT verification failed:", error.message);
        res.status(401).json({
            success: false,
            error: error.message||"Invalid or expired token"
        });
    }
};
