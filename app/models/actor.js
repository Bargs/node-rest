var Sequelize = require("sequelize");

var Actor = sequelize.define('Actor', {
    actor_id: Sequelize.INTEGER,
    first_name: Sequelize.STRING(45),
    last_name: Sequelize.STRING(45),
    freezeTableName: true,
    timestamps: true,
    createdAt: false,
    updatedAt: 'last_update'
});
