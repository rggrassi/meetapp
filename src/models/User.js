const bcrypt = require('bcryptjs');

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('User', {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.VIRTUAL,        
        password_hash: DataTypes.STRING,
    })

    User.beforeSave(async user => {
        if (user.password) {
            user.password_hash = await gerarHash(user.password);
        }
    })

    User.prototype.checkPassword = async function(password) {
        return await bcrypt.compare(password, this.password_hash);
    }

    return User;
}

const gerarHash = async password => {
    const salt = await bcrypt.genSalt();    
    return await bcrypt.hash(password, salt);
}