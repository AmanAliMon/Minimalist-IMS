const action_codes = {
  AuthFailure: 1,
  InvalidCredentials: 2,
  DatabaseError: 3,
  MiddlewareRule: 4,
};

function response(message, response, failure, actionCode) {
  return {
    message: message,
    response: response,
    failure: failure ?? false,
    actionCode: actionCode ?? 0,
  };
}
function requireLogin(req, res, callback) {
  if (!req.session.user) {
    return res
      .status(401)
      .json(response("Login in order to continue", {}, true, 1));
  }
  return callback();
}

module.exports = { requireLogin, response, action_codes };
