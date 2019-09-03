const Yup = require('yup');
const { isBefore, startOfHour, parseISO } = require('date-fns');

const index = async ({ Meetup, User }, req, res) => {
  const { page = 1 } = req.query;
  const meetups = await Meetup.findAll({
    where: { user_id: req.user.id },
    order: ['date'],
    attributes: ['id', 'title', 'description', 'location', 'date'],
    limit: 10,
    offset: (page - 1) * 10, 
    include: [{
      model: User,
      as: 'user',
      attributes: ['id', 'name']
    }] 
  })
  return res.json(meetups);
}

const create = async (Meetup, req, res) => {
  const schema = Yup.object().shape({
    title: Yup.string().required(),
    description: Yup.string().required(),
    location: Yup.string().required(),
    date: Yup.date().required(),
    banner_id: Yup.number().required()
  })
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails.' })
  }

  /**
   * Check for past dates
   */
  const firstHourDate = startOfHour(parseISO(req.body.date));
  if (isBefore(firstHourDate, new Date())) {
    return res.status(400).json({ error: 'Past dates are not permited.' })
  }

  const meetup = await Meetup.create({ ...req.body, user_id: req.user.id });
  return res.json(meetup);   
}

const update = async (Meetup, req, res) => {
  const schema = Yup.object().shape({
    title: Yup.string(),
    description: Yup.string(),
    location: Yup.string(),
    date: Yup.date(),
    banner_id: Yup.number()    
  })
  if (!(await schema.isValid(req.body))) {
    return res.status(400).json({ error: 'Validation fails.' })
  }

  const meetup = await Meetup.findByPk(req.params.id);

  if (!meetup) {
    return res.status(400).json({ error: 'Meetup not found.' });
  }

  if (isBefore(meetup.date, new Date())) {
    return res.status(401).json({ error: 'Unable to change a meetup that already happened.' });
  }

  if (meetup.user_id !== req.user.id) {
    return res.status(401).json({ error: "You don't have permission to update this meetup." });
  }

  const { id, title, description, date, location } = await meetup.update(req.body);
  return res.json({ id, title, description, date, location });
}

const remove = async (Meetup, req, res) => {
  const meetup = await Meetup.findByPk(req.params.id);

  if (!meetup) {
    return res.status(400).json({ error: 'Meetup not found.' });
  }

  if (isBefore(meetup.date, new Date())) {
    return res.status(401).json({ error: 'Unable to cancel a meetup that already happened.' })
  }

  if (meetup.user_id !== req.user.id) {
    return res.status(401).json({ error: "You don't have permission to cancel this meetup." });
  }

  await Meetup.destroy({ where: { id: req.params.id } });

  return res.send();
}

module.exports = { create, index, update, remove }