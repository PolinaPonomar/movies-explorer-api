const errorMessages = {
  BadRequestBody: 'Переданы некорректные данные в тело запроса',
  BadRequestId: 'Некорректный _id в адресе запроса',
  ConflictEmail: 'Пользователь с переданным email уже существует',
  Unauthorized: 'Неправильные почта или пароль',
  NotFoundUser: 'Пользователь с указанным _id не найден',
  NotFoundMovie: 'Фильм с указанным _id не найден',
  NotFoundWay: 'Ресурс не найден',
  Forbidden: 'Нет прав на данное действие',
  noAuthorizationHeader: 'Необходима авторизация',
  wrongToken: 'Токен не прошел проверку',
  internalServerError: 'На сервере произошла ошибка',
};

const answerMessages = {
  movieDeleted: 'Фильм удален',
};

module.exports = { errorMessages, answerMessages };
