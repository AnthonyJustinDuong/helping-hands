const environment = process.env.NODE_ENV === 'development' ?
  `http://localhost:${process.env.REACT_APP_PORT}` :
  '' ;

export const validateUsernamePattern = username => {
  const errors = [];

  if (username.length < 2) {
    errors.push("Username must be at least 2 characters long");
  }
  // if (!/^[a-zA-Z]/.test(username)) {
  //   errors.push("Username must start with a letter");
  // }
  if (!/^\w*$/.test(username)) {
    errors.push("Username must contain only letters, numbers, or underscores (_)");
  }
  if (errors.length === 0 && !/^\w{2,}$/.test(username)) {
    errors.push("Please choose another username");
  }

  return errors;
}

export const validateUniqueUsername = username => {
  // return new Promise(function(resolve, reject) {
  //   resolve(username !== "user" && username !== "user*")
  // });
  return fetch(environment + `/users/unique-username/${username}`)
    .then(res => {
      if (res.status === 200) return res.json();
      return Promise.reject();
    })
    .then(json => {
      return json.status;
    })
    .catch(err => "Could not verify username");
}

export const validateEmailPattern = email => {
  // from emailregex.com
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
      return ["Invalid email"]
  }
  return [];
}

export const validateUniqueEmail = email => {
  // return new Promise(function(resolve, reject) {
  //   resolve(email !== "user@mail.com" && email !== "user")
  // });
  return fetch(environment + `/users/unique-email/${email}`)
    .then(res => {
      if (res.status === 200) return res.json();
      return "Could not verify email";
    })
    .then(json => {
      return json.status;
    })
    .catch(err => "Could not verify email");
}

export const validatePhoneNumber = phoneNumber => {
  const errors = [];
  if (!/^([ ()+-]?[\w][ ()+-]?){10,12}$/.test(phoneNumber))
    errors.push("Phone number may contain only 10 - 12 digits");

  return errors;
}

export const validatePassword = password => {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A - Z)");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a - z)");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit (0 - 9)");
  }
  if (!/[!@#$%^&*+=._-]/.test(password)) {
    errors.push("Password must contain at least one these special characters (!@#$%^&*+=._-)");
  }

  return errors;
}

export const validateName = name => {
  const errors = [];
  if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  }
  if (!/^[a-zA-Z-]+$/.test(name)) {
    errors.push("Name may only contain letters (a - z or A - Z) or hyphens (-)");
  }
  if (errors.length === 0 && !/^[a-zA-Z-]{2,}$/.test(name)) {
    errors.push("Please enter another name");
  }
  return errors;
}

export const validateConfirm = (pwd1, pwd2) => {
  if (pwd1 !== pwd2) return ["Passwords do not match"];
  return [];
}
