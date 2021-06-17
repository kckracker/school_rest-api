'use strict';
// Importing sequelize references
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {};
    User.init({
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'firstName'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'firstName'"
                }
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'lastName'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'lastName'"
                }
            }
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'email'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'email'"
                }
            }
        },
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'password'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'password'"
                }
            }
        },
    },{
        sequelize,
        modelName: "User",
        timestamps: false
    });
    // Creates association relationship with Course model
    User.associate = (models) => {
        User.hasMany(models.Course);
    };
    
    return User;
};

