const sequelize = require('../util/databse')
const Sequelize = require('sequelize')

const Order = sequelize.define('order' , {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      paymentId: Sequelize.STRING,
      orderId: Sequelize.STRING,
      status : Sequelize.STRING
})
module.exports=Order;