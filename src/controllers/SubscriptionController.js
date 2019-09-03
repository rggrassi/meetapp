const Yup = require('yup');
const {  isBefore, parseISO } = require('date-fns');

const create = async ({ Meetup, Subscription }, req, res) => {
    const schema = Yup.object().shape({
        date: Yup.date().required(),
        meetup_id: Yup.number().required()
    })

    if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Validation fails.' });
    }

    const meetup = await Meetup.findByPk(req.params.meetup_id);

    if (!meetup) {
        return res.status(404).json({ error: 'Meetup not found.' })
    }

    /**
     *  Check if the user trying to sign up is not the meetup organizer. 
     */
    if (req.user.id === meetup.user_id) {
        return res.status(401).json({ error: 'The user can only subscribe to meetups that does not organize.' })
    } 

    /**
     * Check for past dates
     */
    const parseDate = parseISO(req.body.date);
    if (isBefore(parseDate, new Date())) {
        return res.status(401).json({ error: 'Past dates are not permited.' })
    }

    /**
     *  Check if user is already subscribed to meetup
     */
    const isSubscribedMeetup = Subscription.findOne({
        where: { user_id: req.user.id, meetup_id: req.params.meetup_id }
    })
    if (isSubscribedMeetup) {
        return res.status(401).json({ error: 'User already signed up for selected meetup.' })
    }

    /**
     *  Check if the user already has a meeting at the selected time  
     */
    const isSubscribedOnTime = Subscription.findOne({
        where: { user_id: req.user.id },
        include: [{ model: Meetup, required: true, where: { date: meetup.date } }]
    })
    if (isSubscribedOnTime) {
        return res.status(401).json({ error: 'User already has a meetup at the selected time.' })
    }

    const subscription = await Subscription.create({ ...req.body, meetup_id: req.params.meetup_id, user_id: req.user.id });

    return res.json(subscription);
}

module.exports = { create }