module.exports = function(Sequelize, DataTypes) => {
    const Subscription = Sequelize.define('Subscription', {
        date: DataTypes.DATE
    })

    Subscription.associate = models => {
        Subscription.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' }),
        Subscription.belongsTo(models.Meetup, { foreignKey: 'meetup_id', as: 'meetup' })
    }
}