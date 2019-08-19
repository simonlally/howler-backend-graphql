module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "username cannot be empty";
  }
  if (email.trim() === "") {
    errors.email = "email cannot be empty";
  } else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
      errors.email = "email is not a valid email address";
    }
  }
  if (password === "") {
    errors.password = "password cannot be empty";
  } else if (password != confirmPassword) {
    errors.confirmPassword = "passwords do not match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
