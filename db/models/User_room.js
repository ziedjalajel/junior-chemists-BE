module.exports = (sequelize) => {
  const User_room = sequelize.define("User_room", {});

  User_room.associate = (models) => {
    models.User.belongsToMany(models.Room, {
      through: User_room,
      foreignKey: "userId",
      as: "rooms",
    });
    models.Room.belongsToMany(models.User, {
      through: User_room,
      foreignKey: "roomId",
      as: "users",
    });
  };

  return User_room;
};
