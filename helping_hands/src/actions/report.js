const environment = process.env.NODE_ENV === 'development' ?
  `http://localhost:${process.env.REACT_APP_PORT}` :
  '' ;

const getAllReports = () => {
  return fetch(environment + "/reports").then((res) => res.json());
};

const getAllReportsForUser = (userId) => {
  return fetch(environment + "/reports/user/" + userId).then((res) =>
    res.json()
  );
};

const addReport = (userId, postId, content) => {
  return fetch(environment + "/reports", {
    method: "POST",
    body: JSON.stringify({
      author: userId,
      post: postId,
      content: content,
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
};

const removeReport = (reportId) => {
  return fetch(environment + "/reports/" + reportId, {
    method: "DELETE",
  });
};

module.exports = {
  getAllReports,
  getAllReportsForUser,
  addReport,
  removeReport,
};
