import jwt from "jsonwebtoken";

/**
 * requireAuth middleware:
 * - validates Bearer token
 * - attaches req.userId for protected routes
 */
export function requireAuth(req, res, next) {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.id;
        next();
    } catch (e) {
        return res.status(401).json({ message: "Invalid token" });
    }
}