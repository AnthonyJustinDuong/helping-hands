const getAllReports = () => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/reports").then((res) => res.json());
};

const getAllReportsForUser = (userId) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/reports/user/" + userId).then((res) =>
    res.json()
  );
};

const addReport = (userId, postId, content) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/reports", {
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
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/reports/" + reportId, {
    method: "DELETE",
  });
};

module.exports = {
  getAllReports,
  getAllReportsForUser,
  addReport,
  removeReport,
};
