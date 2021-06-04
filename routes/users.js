const express = require('express');
const { getCurrentUser, updateCurrentUser } = require('../controllers/users');

const usersRouter = express.Router();

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', updateCurrentUser);

module.exports = { usersRouter };
