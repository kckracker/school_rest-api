'use strict';
// Importing sequelize references
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Course extends Model {};
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'title'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'title'"
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Please enter a value for 'description'"
                },
                notEmpty: {
                    msg: "Please enter a value for 'description'"
                }
            }
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: "Course",
    });
    // Creates association relationship with User model
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
            name: "userId",
            type: DataTypes.INTEGER
            }
        });
    };
    return Course;
};