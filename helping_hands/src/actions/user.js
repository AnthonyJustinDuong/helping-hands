import {
  validateUniqueUsername, validateUniqueEmail, validateEmailPattern,
  validatePhoneNumber, validatePassword,
} from "./formValidation.js";

const environment = process.env.NODE_ENV === 'development' ?
  `http://localhost:${process.env.REACT_APP_PORT}` :
  '' ;

// GET user information by id
export const getUserById = (userId, projection) => {
  return fetch(environment + `/users/${userId}?projection=${projection}`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .catch(error => {
      console.error(error);
    });
}

export const loggedIn = (user) => {
  return (user !== null);
}

// POST add user
const addUser = (userInfo) => {
  const request = new Request(environment + "/users", {
    method: "post",
    body: JSON.stringify(userInfo),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res => res.status === 200)
    .catch(error => {
      console.log(error);
      return false;
    });
};

export const registerUser = information => {
  return new Promise(async function(resolve, reject) {
    const {
      firstName, lastName, username,
      password, confirmPassword,
      email, phoneNumber,
      streetAddress, city, province, location
    } = information;

    const usernameReason = await validateUniqueUsername(username);
    if (usernameReason === "taken") reject("Username is already taken");
    if (usernameReason === "Could not verify username") reject("Cannot verify username at the moment");
    const emailReason = await validateUniqueEmail(email);
    if (emailReason === "taken") reject("E-mail is already registered");
    if (emailReason === "Could not verify email") reject("Cannot verify email at the moment");

    // Confident that these regexs match a superset of the corresponding validate function
    if (!/^[a-zA-Z-]{2,}$/.test(firstName)) reject("Invalid first name");
    if (!/^[a-zA-Z-]{2,}$/.test(lastName)) reject("Invalid last name");
    if (!/^\w{2,}$/.test(username)) reject("Invalid username");
    if (validatePassword(password).length > 0) reject("Invalid password");
    if (password !== confirmPassword) reject("Passwords do no match");

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) reject("Invalid email");
    if (!/^([ ()+-]?[\w][ ()+-]?){10,12}$/.test(phoneNumber)) reject("Invalid phone number")

    resolve(addUser({
      username, firstName, lastName, password, email, phoneNumber,
      streetAddress, city, province, location,
    }));
  });
};

// POST request with the user to be logged in
export const login = usernamePassword => {
  const request = new Request(environment + "/users/login", {
    method: "post",
    body: JSON.stringify(usernamePassword),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res => {
      if (res.status === 200) return res.json();
      return null;
    })
    .catch(error => {
        console.log(error);
    });
};

// PATCH user's email
export const modifyEmail = (userId, email) => {
      const request = new Request(environment + `/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({"email": email}),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      });

      return fetch(request)
        .then(res => {
			if (res.status === 200) return res;
			return null;
		})
        .catch(error => {
			console.log(error)
		});
}

// PATCH user's password
export const modifyPassword = (userId, password, confirmPassword) => {
      const request = new Request(environment + `/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({"password": password}),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      });

      return fetch(request)
        .then(res => {
			if (res.status === 200) return res;
			return null;
		})
        .catch(error => {
			console.log(error)
	  });
}


// PATCH user's phone number
export const modifyPhoneNumber = (userId, phoneNumber) => {
      const request = new Request(environment + `/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({"phoneNumber": phoneNumber}),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      });

      return fetch(request)
        .then(res => {
			if (res.status === 200) return res;
			return null;
		})
        .catch(error => {
			console.log(error)
	  });
}

// PATCH add post to user's bookmarked
export const addPostToBookmarks = (userId, postId) => {
  // SERVER CALL: add postId to userId's bookmarks
  // POST rquest to route or PATCH
  // getUserById(userId, "bookmarked").bookmarked.push(postId);

  const request = new Request(`/users/${userId}/bookmarked`, {
    method: "post",
    body: JSON.stringify({post: postId}),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res =>
		{if (res.status === 200) return res;
		return null;})
    .catch(error => console.error(error))
};

// PATCH remove post from user's bookmarked
export const removePostFromBookmarks = (userId, postId) => {
  const request = new Request(environment + `/users/${userId}/bookmarked`, {
    method: "delete",
    body: JSON.stringify({post: postId}),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res =>
		{if (res.status === 200) return res;
		return null;})
    .catch(error => console.error(error))
};
