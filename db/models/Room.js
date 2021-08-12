const SequelizeSlugify = require("sequelize-slugify");

module.exports = (sequelize, DataTypes) => {
  const Room = sequelize.define("Room", {
    name: {
      type: DataTypes.STRING,
    },
    slug: {
      type: DataTypes.STRING,
    },
  });

  SequelizeSlugify.slugifyModel(Room, {
    source: ["name"],
  });
  return Room;
};
