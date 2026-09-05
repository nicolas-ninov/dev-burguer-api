import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.js'

const authMiddleware = (req, res, next) => {
    const authToken = req.headers.authorization;
    console.log(authToken)
    if (!authToken) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    const token = authToken.split(' ')[1];

    try {
        jwt.verify(token, authConfig.secret, (error, decoded) => {
            if (error) {
                throw Error();
            }

            req.userId = decoded.id
        })
    } catch (_err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    return next();
}

export default authMiddleware;