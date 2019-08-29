const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: 'Token not provided.' })
    }
    const [bearer, token] = authorization.split(' ');
    try {
        const { id, name, email } = jwt.verify(token, '3d18af19790ccfc67fe83bcec716524c');
        req.user = { id, name, email };
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token not valid.' });
    } 
}