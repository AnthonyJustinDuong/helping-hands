import React from "react";
import { withRouter } from "react-router-dom";
import "./styles.css";

import {
  getAllPostsForUser,
  getBookmarkedPostsForUser,
} from "../../actions/posts.js";

import { getUserById } from "../../actions/user.js";
import { createChatRoom } from "../../actions/chat.js"

import placeholder from "../../assets/placeholder.png";
import Achievements from "./Achievements";
import Requests from "./Requests";
import Edit from "./Edit";

/* Component for the Profile page */
class Profile extends React.Component {
  state = {
    editingProfile: false,
    userId:
      window.location.pathname.length > 9
        ? window.location.pathname.substring(9)
        : "no-user",
    posts: [],
    user: null,
  };

  toggleEditing() {
    if (this.state.editingProfile) {
      getAllPostsForUser(this.state.user).then((posts) => {
        this.setState({ editingProfile: false, posts: posts });
      });
    } else {
      getBookmarkedPostsForUser(this.state.user).then((posts) => {
        this.setState({ editingProfile: true, posts: posts });
      });
    }
  }

  messageUser() {
    createChatRoom(this.props.state.currentUser._id, this.state.userId)
    .then(res => {
      return getUserById(this.props.state.currentUser._id)
    })
    .then(currentUser => {
        this.props.setGlobalState({ currentUser }, () =>
          this.props.history.push("../messages")
        )
      }
    );
  }

  getUserInfo() {
    const { user } = this.state;
    if (user) {
      return (
        <>
          <div id="avatarContainer">
            <img
              id="avatar"
              src={require("../../assets/" + user.avatar)}
              alt="profile"
            />
          </div>
          <h1 className="profileHeader">{user.username}</h1>
          <h1 className="profileHeader">{user.fullName}</h1>
          <p>{user.phoneNumber}</p>
          <p>{user.email}</p>
          <p>{user.city}</p>
          <p>User type: {user.accessLevel}</p>
          <p>
            Achievement points: <span className="points">{user.points}</span>
          </p>
        </>
      );
    } else {
      return (
        <>
          <div id="avatarContainer">
            <img id="avatar" src={placeholder} alt="profile" />
          </div>
          <h1 className="profileHeader">Not logged in</h1>
          <h1 className="profileHeader">Full name</h1>
          <p>City</p>
          <p>User type: none</p>
          <p>Achievement points</p>
        </>
      );
    }
  }

  componentDidMount() {
    getUserById(this.state.userId, "-password+-bookmarked")
      .then((user) => this.setState({ user: user }))
      .then(() => {
        return getAllPostsForUser(this.state.user);
      })
      .then((posts) => {
        this.setState({ posts: posts });
      });
  }

  render() {
    return (
      <div className="profile">
        <div className="column" id="profileInfo">
          {this.getUserInfo()}
          <br />
          {this.props.state.currentUser &&
          <p className="clickableText" onClick={() => this.messageUser()}>
            Private message user
          </p>
        }{" "}
          <br />
          {this.props.state.currentUser &&
          this.props.state.currentUser._id === this.state.userId ? (
            <p className="clickableText" onClick={() => this.toggleEditing()}>
              Edit profile
            </p>
          ) : (
            <p />
          )}
        </div>
        <Requests state={this.props.state} profileState={this.state} />
        {this.state.editingProfile ? (
          <Edit
            userId={this.state.userId}
            history={this.props.history}
            setGlobalState={this.props.setGlobalState}
          />
        ) : (
          <Achievements userId={this.state.userId} />
        )}
      </div>
    );
  }
}

export default withRouter(Profile);
