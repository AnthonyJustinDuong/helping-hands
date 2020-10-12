const date = require("date-and-time");

const getAllPosts = () => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts")
    .then((res) => res.json())
    .then((posts) =>
      posts.map((post) => {
        post.date = date.parse(
          post.date.slice(0, 19),
          "YYYY-MM-DDTH:mm:ss",
          true
        );
        return post;
      })
    )
    .then((posts) => posts.sort((x, y) => y.date - x.date));
};

const getPost = (postId) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/" + postId).then((res) =>
    res.json()
  );
};

const getFulfilledPosts = () => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/fulfilled")
    .then((res) => res.json())
    .then((posts) =>
      posts.map((post) => {
        post.date = date.parse(
          post.date.slice(0, 19),
          "YYYY-MM-DDTH:mm:ss",
          true
        );
        return post;
      })
    )
    .then((posts) => posts.sort((x, y) => y.date - x.date));
};

const getUnfulfilledPosts = () => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/unfulfilled")
    .then((res) => res.json())
    .then((posts) =>
      posts.map((post) => {
        post.date = date.parse(
          post.date.slice(0, 19),
          "YYYY-MM-DDTH:mm:ss",
          true
        );
        return post;
      })
    )
    .then((posts) => posts.sort((x, y) => y.date - x.date));
};

const getBookmarkedPostsForUser = (user) => {
  const requests = [];
  for (let i = 0; i < user.bookmarked; i++) {
    requests.push(
      fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/" + user.bookmarked[i]).then((res) =>
        res.json()
      )
    );
  }
  return Promise.all(requests)
    .then((posts) =>
      posts.map((post) => {
        post.date = date.parse(
          post.date.slice(0, 19),
          "YYYY-MM-DDTH:mm:ss",
          true
        );
        return post;
      })
    )
    .then((posts) => posts.sort((x, y) => y.date - x.date));
};

const getAllPostsForUser = (user) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/user/" + user._id)
    .then((res) => res.json())
    .then((posts) =>
      posts.map((post) => {
        post.date = date.parse(
          post.date.slice(0, 19),
          "YYYY-MM-DDTH:mm:ss",
          true
        );
        return post;
      })
    )
    .then((posts) => posts.sort((x, y) => y.date - x.date));
};

const addPost = (user, content) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts", {
    method: "POST",
    body: JSON.stringify({
      author: user._id,
      date: new Date(),
      status: false,
      content: content,
    }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
};

const removePost = (postId) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/" + postId, {
    method: "DELETE",
  });
};

const changePostStatus = (postId, isResolved) => {
  return fetch(process.env.REACT_APP_LOCAL_PATH + "/posts/" + postId, {
    method: "PATCH",
    body: JSON.stringify({ status: isResolved }),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
};

module.exports = {
  getAllPosts,
  getPost,
  getFulfilledPosts,
  getUnfulfilledPosts,
  getBookmarkedPostsForUser,
  getAllPostsForUser,
  addPost,
  removePost,
  changePostStatus,
};
