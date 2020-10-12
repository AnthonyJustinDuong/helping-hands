import React from "react";
import { withRouter } from "react-router-dom";
import Feed from "./Feed";
import MapContainer from "./MapContainer";
import "./styles.css";

import {
  getAllPosts,
  getFulfilledPosts,
  getUnfulfilledPosts,
  getBookmarkedPostsForUser,
  addPost,
  removePost,
  changePostStatus,
} from "../../actions/posts.js";

import {
  getUserById,
  addPostToBookmarks,
  removePostFromBookmarks,
} from "../../actions/user.js";

import { createChatRoom } from "../../actions/chat.js";

/* The HelpNeeded Component */
class HelpNeeded extends React.Component {
  state = {
    posts: [],
    filter: "NEWEST",
    userLoc: { lat: 43.6629, lng: -79.3957 },
    selected: -1,
  };

  onPostEvent = (content) => {
    addPost(this.props.state.currentUser, content)
      .then(() => {
        this.update(this.state.filter);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onDeleteEvent = (postId) => {
    removePost(postId)
      .then(() => {
        this.update(this.state.filter);
      })
      .catch((e) => console.log(e));
  };

  onFilterEvent = (filter) => {
    this.update(filter);
  };

  onResolveEvent = (postId, isResolved) => {
    changePostStatus(postId, isResolved)
      .then(() => {
        this.update(this.state.filter);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  onBookmarkEvent = (postId, isBookmarked) => {
    if (isBookmarked) {
      removePostFromBookmarks(this.props.state.currentUser._id, postId)
        .then(() => {
          this.update(this.state.filter);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      addPostToBookmarks(this.props.state.currentUser._id, postId)
        .then(() => {
          this.update(this.state.filter);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  onSelectEvent = (postId) => {
    this.setState({
      selected: postId,
    });
  };

  onContactEvent = (contactId) => {
    createChatRoom(this.props.state.currentUser._id, contactId)
    .then(res => {
      return getUserById(this.props.state.currentUser._id)
    })
    .then(currentUser => {
        this.props.setGlobalState({ currentUser }, () =>
          this.props.history.push("../messages")
        )
      }
    );
  };

  // FOR PROFILE ICON CLICK (ON USERID'S POST)
  onRedirectEvent = (userId) => {
    this.props.history.push("../profile/" + userId);
  };

  update = (filter) => {
    if (filter === "NEWEST") {
      getAllPosts()
        .then((posts) => {
          this.setState({ posts: posts, filter: "NEWEST", selected: -1 });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (filter === "OLDEST") {
      getAllPosts()
        .then((posts) => {
          this.setState({
            posts: posts.reverse(),
            filter: "OLDEST",
            selected: -1,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (filter === "FULFILLED") {
      getFulfilledPosts()
        .then((posts) => {
          this.setState({ posts: posts, filter: "FULFILLED", selected: -1 });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (filter === "UNFULFILLED") {
      getUnfulfilledPosts()
        .then((posts) => {
          this.setState({ posts: posts, filter: "UNFULFILLED", selected: -1 });
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (filter === "BOOKMARKED") {
      getBookmarkedPostsForUser(this.props.state.currentUser)
        .then((posts) => {
          this.setState({ posts: posts, filter: "BOOKMARKED", selected: -1 });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  componentDidMount() {
    this.update(this.state.filter);
  }

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.setState({
          selected: -1,
          userLoc: { lat: latitude, lng: longitude },
        });
      });
    }
  };

  render() {
    return (
      <div className="helpNeeded">
        <Feed
          state={this.props.state}
          onPostEvent={this.onPostEvent}
          onDeleteEvent={this.onDeleteEvent}
          onFilterEvent={this.onFilterEvent}
          onResolveEvent={this.onResolveEvent}
          onBookmarkEvent={this.onBookmarkEvent}
          onSelectEvent={this.onSelectEvent}
          onContactEvent={this.onContactEvent}
          onRedirectEvent={this.onRedirectEvent}
          filter={this.state.filter}
          posts={this.state.posts}
        />
        <div id="mapContainer">
          <MapContainer
            state={this.props.state}
            posts={this.state.posts}
            userLoc={this.state.userLoc}
            zoom={15}
            selected={this.state.selected}
            setSelectedPost={(postId) => {
              this.setState({
                selected: postId,
              });
            }}
          />
          <button onClick={this.getLocation}>Jump to current location.</button>
        </div>
      </div>
    );
  }
}

export default withRouter(HelpNeeded);
