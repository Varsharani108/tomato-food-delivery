import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {

        // Get token from request headers
        const { token } = req.headers;

        if (!token) {
            return res.json({
                success: false,
                message: "Not Authorized. Login Again"
            });
        }

        // Verify token
        const token_decode = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Add user ID to request body
        req.body.userId = token_decode.id;

        // Continue to next middleware/controller
        next();

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: "Invalid Token"
        });
    }
};

export default authMiddleware;