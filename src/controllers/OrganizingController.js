const index = async (Meetup, req, res) => {
    const meetups = await Meetup.findAll({
      where: { user_id: req.user.id },
      order: ['date'],
    })
    return res.json(meetups);
}

module.exports = { index }