const express = require('express');
const { getCurrentUser, updateCurrentUser } = require('../controllers/users');
const { validateUpdatedUserBody } = require('../middlewares/validation');

const usersRouter = express.Router();

usersRouter.get('/me', getCurrentUser);
usersRouter.patch('/me', validateUpdatedUserBody, updateCurrentUser);

module.exports = usersRouter;
