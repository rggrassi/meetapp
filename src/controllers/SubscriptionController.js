const Yup = require('yup');
const { isBefore, parseISO } = require('date-fns');

const create = async (Subscription, req, res) => {
    const schema = Yup.object().shape({
        date: Yup.date().required(),
        meetup_id: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });
    }

    const parseDate = parseISO(req.body.date);
    if (isBefore(parseDate, new Date())) {
        return res.status(401).json({ error: 'Past dates are not permited.' })
    }

    

    const subscription = await Subscription.create({ ...req.body, user_id: req.user.id });

    return res.json(subscription);
}

module.exports = { create }