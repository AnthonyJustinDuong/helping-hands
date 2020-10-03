import React from "react";
import check from "../check.svg";
import "./styles.css";

import { loggedIn } from "../../../actions/user.js";

class Options extends React.Component {
  componentDidMount() {
    document.addEventListener("mouseup", this.props.onClickEvent);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.props.onClickEvent);
  }

  render() {
    return (
      <div className="items">
        {this.props.post.author === this.props.state.currentUser._id && (
          <div
            className="item"
            onClick={() =>
              this.props.onResolveEvent(
                this.props.post._id,
                !this.props.post.status
              )
            }
          >
            Resolve
            {this.props.post.status && (
              <img className="check" src={check} alt="check" />
            )}
          </div>
        )}
        {(this.props.post.author === this.props.state.currentUser._id ||
          this.props.state.currentUser.accessLevel === "admin") && (
          <div
            className="item"
            onClick={() => this.props.onDeleteEvent(this.props.post._id)}
          >
            Delete
          </div>
        )}
        {this.props.state.currentUser &&
          this.props.post.author !== this.props.state.currentUser._id && (
            <div
              className="item"
              onClick={() => this.props.onContactEvent(this.props.post.author)}
            >
              Contact
            </div>
          )}
        {loggedIn(this.props.state.currentUser) && (
          <div
            className="item"
            onClick={() => {
              this.props.onBookmarkEvent(
                this.props.post._id,
                this.props.state.currentUser.bookmarked.includes(
                  this.props.post._id
                )
              );
            }}
          >
            Bookmark
            {this.props.state.currentUser.bookmarked.includes(
              this.props.post._id
            ) && <img className="check" src={check} alt="check" />}
          </div>
        )}
        {this.props.post.author !== this.props.state.currentUser._id && (
          <div className="item" onClick={this.props.onReportEvent}>
            Report
          </div>
        )}
      </div>
    );
  }
}

export default Options;
