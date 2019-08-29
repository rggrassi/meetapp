const jwt = require('jsonwebtoken')

const create = async (User, req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ 
        where: { email }
    })

    if (!user) {
        return res.status(401).json({ error: 'Could not find your account.' })
    }

    if (!(await user.checkPassword(password))) {
        return res.status(401).json({ error: 'Wrong credentials.' })
    }

    const { id, name } = user;
    return res.json({ 
        token: jwt.sign({ id, name, email }, '3d18af19790ccfc67fe83bcec716524c', { expiresIn: '7d' }) 
    })
}

module.exports = { create }