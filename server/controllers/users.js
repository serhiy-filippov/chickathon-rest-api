'use strict';

const User = require('../models/user');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    addUser(req, res, next) {
        const { name, department } = req.body;

        return User
            .upsert({
                fullName: name,
                department: department
            })
            .then(user => {
                res.status(200).send('User ' + name + ' has been created');
            })
            .catch(next)
    },

    showProfile(req, res, next) {
        let id = Number(req.params.id) || null;
        const name = req.params.name || null;

        if (id) {
            return User
                .findByPk(req.params.id)
                .then(user => {
                    if (!user) {
                        return res.status(404).send('User with provided id is not found');
                    } else {
                        return res.status(200).send(user);
                    }
                })
                .catch(next)
        } else if (name) {
            return User
                .findAll({
                    where: {
                        fullName: name
                    }
                })
                .then(user => {
                    res.status(200).send(user);
                })
                .catch(next)
        } else {
            res.status(400).send('No username or his id was provided');
        }
    },

// returns array of users' IDs
    showAllIds(req, res, next) {
        let idsArray = [];

        return User
            .findAll()
            .then(users => {
                for (let key in users) {
                    idsArray.push(users[key].id)
                }
                console.log(idsArray);
                res.status(200).send(idsArray);
            })
            .catch(next)
    },

    showAllUsersUpdatedAfter(req, res, next) {
// date needs to be passed by updated_date variable through request headers in format YYYY-MM-DD GMT
        let neededDate = new Date(Date.parse(req.headers.updated_date));

        return User
            .findAll({
                where: {
                    updatedAt: {
                        [Op.gt]: neededDate
                    }
                }
            })
            .then(users => {
                res.status(200).send(users);
            })
            .catch(next)
    },

    updateProfile(req, res) {

    },

    deleteUser(req, res) {

    }
}