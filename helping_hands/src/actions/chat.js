const environment = process.env.NODE_ENV === 'development' ?
  `http://localhost:${process.env.REACT_APP_PORT}` :
  '' ;

// POST new message in chat
export const sendMessage = (chatId, message) => {
  const request = new Request(environment + `/chatrooms/${chatId}`, {
    method: "post",
    body: JSON.stringify(message),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res => {
      if (res.status === 200) return res.json();
    })
    .catch(error => {
      console.log(error);
      return false;
    });
}

// GET entire chat document by id
export const getChatById = (chatId, projection) => {
  return fetch(environment + `/chatrooms/${chatId}?projection=${projection}`)
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .catch(error => {
      console.error(error);
    });
}

// POST chat room
export const createChatRoom = (creator, otherChatter) => {
  const request = new Request(environment + "/chatrooms", {
    method: "post",
    body: JSON.stringify({creator, otherChatter}),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json"
    }
  });

  return fetch(request)
    .then(res => {
      if (res.status === 200) return res.json();
    })
    .catch(error => {
      console.log(error);
      return false;
    });
}
