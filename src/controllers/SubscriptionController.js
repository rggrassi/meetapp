const { isBefore } = require('date-fns');
const Queue = require('../lib/Queue');
const NewSubscription = require('../jobs/NewSubscription');

const create = async ({ Meetup, Subscription }, req, res) => {
    const meetup = await Meetup.findByPk(req.params.meetupId, {
        include: [{ model: User, as: user, attributes: ['name', 'email'] }]
    });

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
     * Check's if the meetup has already been held
     */
    if (isBefore(meetup.date, new Date())) {
        return res.status(401).json({ error: 'Unable to sign up for meetups that have already happened.' })
    }
    /**
     *  Check if user is already subscribed to meetup
     */
    const isSubscribedMeetup = await Subscription.findOne({
        where: { user_id: req.user.id, meetup_id: req.params.meetupId }
    })
    if (isSubscribedMeetup) {
        return res.status(401).json({ error: 'User already signed up for selected meetup.' })
    }
    /**
     *  Check if the user already has a meeting at the selected time  
     */
    const isSubscribedOnTime = await Subscription.findOne({
        where: { user_id: req.user.id },
        include: [{ model: Meetup, as: 'meetup', required: true, where: { date: meetup.date } }]
    })
    if (isSubscribedOnTime) {
        return res.status(401).json({ error: 'User already has a meetup at the selected time.' })
    }

    const subscription = await Subscription.create({ 
        date: new Date(), 
        meetup_id: req.params.meetupId, 
        user_id: req.user.id 
    });

    await Queue.add(NewSubscription.key, { meetup, user: req.user });

    return res.json(subscription);
}

module.exports = { create }