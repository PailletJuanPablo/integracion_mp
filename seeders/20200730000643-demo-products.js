'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('products', [{
      name: 'Computadora MAX3000',
      image: 'https://i.pinimg.com/736x/9f/d0/17/9fd01710b9cd187abdde1a7982a1177a.jpg',
      description: 'Una compu',
      price: 75.23,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Mouse de Oro',
      image: 'https://theawesomer.com/photos/2009/04/040709_mouse_2.jpg',
      description: 'Mouse enchapado en 150 kilates de oro solido',
      price: 152.23,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
