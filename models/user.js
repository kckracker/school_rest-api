'use strict';
// Importing sequelize references
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
            unique: true,
            allowNull: false,
            validate: {
                isEmail: {
                    msg: "Please enter a valid 'email'"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'password'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'password'"
                }
            },
            set(val){
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            }
        },
    },{
        sequelize,
        modelName: "User"
    });
    // Creates association relationship with Course model
    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                name: "userId",
                type: DataTypes.INTEGER
            }
        });
    }
    
    return User;
};

