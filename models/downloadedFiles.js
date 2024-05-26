const Sequelize = require('sequelize')
const sequelize = require('../util/databse');

const DownloadedFiles = sequelize.define('DownloadedFiles' , {
    url: {
        type:Sequelize.STRING,
        allowNull:false
    },
    downloadedAt: {
        type:Sequelize.DATE,
        allowNull:false,
        defaultValue:Sequelize.NOW
    }
});

module.exports=DownloadedFiles;