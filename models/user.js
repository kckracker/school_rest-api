'use strict';
// import sequelize and bcrypt dependencies
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

/**
 * sets module exports to equal anonymous function return
 * 
 * @param {sequelize} sequelize Accepts the sequelize instance for the application 
 * @returns Model instance defined by the .init method.
 * 
 * Sequelize native validators added as appropriate to each field along with 'msg' properties to return upon validation failure.
 * 
 * For email field, isEmail sequelize validator set in place of notNull and notEmpty as this field would address both of those validation failures.
 * 
 * For password field, set method called upon validation to hash password using bcrypt hashSync method before it is stored.
 */
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
    // creates association relationship with Course model
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

