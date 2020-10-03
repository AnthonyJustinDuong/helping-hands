import React from "react";
import "./styles.css";
import more from "./more.svg";
import check from "./check.svg";
import cross from "./cross.svg";
import { getUserById, loggedIn } from "../../actions/user.js";
import { getImage } from "../../actions/image.js";
import Options from "./Options";
import Report from "./Report";

const date = require("date-and-time");

class Post extends React.Component {
  options = React.createRef();
  state = {
    showReport: false,
    showOptions: false,
    user: {
      name: {
        first: "",
        last: "",
      },
      avatar: "placeholder.png",
    },
    image: null,
  };

  onOptionsEvent = () => {
    this.setState({
      showOptions: !this.state.showOptions,
    });
  };

  onClickEvent = (e) => {
    if (!this.options.current.contains(e.target)) {
      this.setState({ showOptions: false });
    }
  };

  onReportEvent = () => {
    this.setState({ showReport: !this.state.showReport, showOptions: false });
  };

  componentDidMount() {
    getUserById(this.props.post.author, "avatar+name")
      .then((user) => {
        this.setState({ user: user });
      })
      .then(() => getImage(this.state.user.username))
      .then((image) => {
        this.setState({ image: image });
      })
      .catch((e) => console.log(e));

    console.log(this.state.image);
    console.log(this.state);
  }

  render() {
    return (
      <div
        className="post"
        onClick={() => this.props.onSelectEvent(this.props.post._id)}
      >
        <div className="outerContainer">
          <div
            className="overlay-avatar"
            onClick={() => this.props.onRedirectEvent(this.props.post.author)}
          ></div>
          <img
            className="avatar"
            src={
              this.state.image
                ? this.state.image.image_url
                : require("../../assets/placeholder.png")
            }
            alt="avatar"
          />
          <div className="innerContainer">
            <p
              className="name"
              onClick={() => this.props.onRedirectEvent(this.props.post.author)}
            >
              {this.state.user.name.first + " " + this.state.user.name.last}
            </p>
            <p className="date">
              {date.format(this.props.post.date, "MMM D, YYYY")}
            </p>
          </div>
        </div>
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: this.props.post.content }}
        ></div>
        <div className="footer">
          <div
            className={
              this.props.post.status ? "footer-item green" : "footer-item red"
            }
          >
            <img
              className={this.props.post.status ? "icon-green" : "icon-red"}
              src={this.props.post.status ? check : cross}
              alt=""
            />
            {this.props.post.status ? "Fulfilled" : "Unfulfilled"}
          </div>
        </div>
        <div ref={this.options}>
          {loggedIn(this.props.state.currentUser) ? (
            <img
              className="options-active"
              src={more}
              alt="options"
              ref={this.button}
              onClick={this.onOptionsEvent}
            />
          ) : (
            <img className="options-inactive" src={more} alt="options" />
          )}
          {this.state.showOptions && (
            <Options
              state={this.props.state}
              post={this.props.post}
              onClickEvent={this.onClickEvent}
              onDeleteEvent={this.props.onDeleteEvent}
              onContactEvent={this.props.onContactEvent}
              onResolveEvent={this.props.onResolveEvent}
              onBookmarkEvent={this.props.onBookmarkEvent}
              onReportEvent={this.onReportEvent}
            />
          )}
        </div>
        {this.state.showReport && (
          <Report
            state={this.props.state}
            post={this.props.post}
            onReportEvent={this.onReportEvent}
          />
        )}
      </div>
    );
  }
}

export default Post;
