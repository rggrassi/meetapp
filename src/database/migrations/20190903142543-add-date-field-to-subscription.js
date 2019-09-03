'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.addColumn('subscriptions', 'date', { 
        type: Sequelize.DATE,
        allowNull: false
      });
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeColumn('subscriptions', 'date');
  }
};
