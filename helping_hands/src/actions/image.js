const addImage = (form, userId) => {
  const imageData = new FormData(form);
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/images/" + userId, {
    method: "POST",
    body: imageData,
  });
};

const getImage = (user) => {
  fetch(process.env.REACT_APP_LOCAL_PATH + "/images/" + user).then((res) => res.json());
};

module.exports = {
  addImage,
  getImage,
};
