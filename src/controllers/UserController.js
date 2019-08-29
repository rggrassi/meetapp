const Yup = require('yup');

const store = async (User, req, res) => {
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6)
    })    
    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' })
    }

    const userExists = await User.findOne({
        where: { email: req.body.email }
    }) 
    if (userExists) {
        return res.status(400).json({ error: 'User not available' })
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({ id, name, email });
}

module.exports = { store }