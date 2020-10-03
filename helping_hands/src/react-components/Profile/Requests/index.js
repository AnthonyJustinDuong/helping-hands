import React from "react";
import Post from "../../Post";
import { uid } from "react-uid";
import { changePostStatus } from "../../../actions/posts.js";

import { createChatRoom } from "../../../actions/chat.js";

import {
  addPostToBookmarks,
  removePostFromBookmarks,
} from "../../../actions/user.js";

class Requests extends React.Component {
  onResolveEvent = (postId, isResolved) => {
    changePostStatus(postId, isResolved);  // NEED TO CALL SETSTATE TO REFRESH POSTS
  };

  onBookmarkEvent = (postId, isBookmarked) => {
    if (isBookmarked) {
      removePostFromBookmarks(this.props.state.currentUser._id, postId);
    } else {
      addPostToBookmarks(this.props.state.currentUser._id, postId);
    }
  };

  onSelectEvent = (postId) => {
    this.setState({
      selected: postId,
    });
  };

  onContactEvent = (contactId) => {
    createChatRoom(this.props.state.currentUser._id, contactId);
    this.props.history.push("../messages");
  };

  // FOR PROFILE ICON CLICK (ON USERID'S POST)
  onRedirectEvent = (userId) => {
    console.log(userId);
  };

  render() {
    // console.log(this.props.state);
    return (
      <div className="column">
        <h1 className="profileHeader">
          {this.props.profileState.editingProfile
            ? "Bookmarked Requests"
            : "Submitted Requests"}
        </h1>
        <div>
          {this.props.profileState.posts.map((post) => (
            <Post
              key={uid(post)}
              onResolveEvent={this.onResolveEvent}
              onBookmarkEvent={this.onBookmarkEvent}
              onSelectEvent={this.onSelectEvent}
              onContactEvent={this.onContactEvent}
              onRedirectEvent={this.onRedirectEvent}
              post={post}
              state={this.props.state}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Requests;
