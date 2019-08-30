module.exports = function(Sequelize, DataTypes) {
    const Meetup = Sequelize.define('Meetup', {
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        location: DataTypes.STRING,
        date: DataTypes.DATE
    })

    Meetup.associate = models => {
        Meetup.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }),
        Meetup.belongsTo(models.File, { foreignKey: 'banner_id', as: 'banner' })
    }

    return Meetup;
}