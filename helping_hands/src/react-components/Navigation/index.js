import React from "react";
import { NavLink } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import "./styles.css";
import { loggedIn } from "../../actions/user.js";

/* The Navigation Component */
class Navigation extends React.Component {
  menu = React.createRef();
  state = {
    showMenu: false,
  };

  onProfileEvent = () => {
    this.setState({ showMenu: !this.state.showMenu });
  };

  onClickEvent = (e) => {
    if (!this.menu.current.contains(e.target)) {
      this.setState({ showMenu: false });
    }
  };

  render() {
    let profileLinks;
    if (loggedIn(this.props.state.currentUser)) {
      profileLinks = (
        <div>
          <div className="profile-navigation" ref={this.menu}>
            <div
              className="avatar-overlay-navigation"
              onClick={this.onProfileEvent}
            ></div>
            <img
              className="avatar-navigation"
              src={require("../../assets/" +
                this.props.state.currentUser.avatar)}
              alt="avatar"
            />
            {this.state.showMenu && (
              <ProfileDropdown
                state={this.props.state}
                setGlobalState={this.props.setGlobalState}
                onProfileEvent={this.onProfileEvent}
                onClickEvent={this.onClickEvent}
              />
            )}
          </div>
        </div>
      );
    } else {
      profileLinks = (
        <NavLink to={"../login"} className="white-button">
          Login
        </NavLink>
      );
    }

    return (
      <nav id="navigation">
        <h1 className="title">Helping Hands.</h1>
        <div className="links">
          <div className="link-container">
            <NavLink exact to={"./../"} className="link">
              Home
            </NavLink>
          </div>
          <div className="link-container">
            <NavLink to={"./../help-needed"} className="link">
              Help Needed
            </NavLink>
          </div>
          <div className="link-container">
            <NavLink to={"./../faq"} className="link">
              FAQ
            </NavLink>
          </div>
          <div className="link-container">
            <NavLink to={"./../leaderboard"} className="link">
              Leaderboard
            </NavLink>
          </div>
        </div>
        {profileLinks}
      </nav>
    );
  }
}

export default Navigation;
