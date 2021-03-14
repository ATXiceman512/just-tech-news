const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connection.js');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {}

// define table columns and configuration
User.init(
  {
      // Define an id column
      id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,

        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,

        // this is the equivalent of SQL's Primary Key
        primaryKey: true,

        //turn on autoIncrement
        autoIncrement: true
      },
      // Define a username Column
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      // define and email column
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,

        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
          // this means the password must be at least four characters long
          isEmail: true
        }
      },
      // define a password column
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // this means the password must be at least four characters long
          len: [4]
        }
      }
  },
    {
      hooks: {
        // set up beforeCreate lifecylce "hook" functionality
        async beforeCreate(newUserData){
          newUserData.password = await bcrypt.hash(newUserData.password, 10);
          return newUserData;
        },
        // set up the beforeUpdate lifecycle "hook" functionality
        async beforeUpdate (updatedUserData) {
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
          return updatedUserData;
        }
      },
      //---- TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

      // Pass in our imported sequelize connection (the direct connection to our database)
      sequelize,

      // dont' automatically create createdAt/updatedAt timestamp fields
      timestamps: false,

      //don't pluralize name of database table
      freezeTableName: true,

      // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
      underscored: true,

      // make it so our model name stays lowercase in the database
      modelName: 'user'
    }
);

module.exports = User;