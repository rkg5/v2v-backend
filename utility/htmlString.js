module.exports.getHtmlString = function getHtmlString(subject, data) {
  if (subject == "reset password") {
    return `<a href=${data.resetURL}>Reset Link</a>`;
  } else if (subject == "signup") {
    return `<h1>Welcome to our website:${data.name}</h1>`;
  }
};
