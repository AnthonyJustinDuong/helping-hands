const environment = process.env.NODE_ENV === 'development' ?
  `http://localhost:${process.env.REACT_APP_PORT}` :
  '' ;

const addImage = (form, userId) => {
  const imageData = new FormData(form);
  return fetch(environment + "/images/" + userId, {
    method: "POST",
    body: imageData,
  });
};

const getImage = (user) => {
  fetch(environment + "/images/" + user).then((res) => res.json());
};

module.exports = {
  addImage,
  getImage,
};
