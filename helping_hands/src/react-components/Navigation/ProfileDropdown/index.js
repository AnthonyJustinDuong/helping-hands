import React from "react";
import { NavLink } from "react-router-dom";
import "./styles.css";

/* The ProfileDropdown Component */
class ProfileDropdown extends React.Component {
  renderReviewTab = () => {
    if (this.props.state.currentUser.accessLevel === "admin") {
      return (
        <div className="link-container-dropdown">
          <NavLink
            to={"../review-board"}
            className="link-dropdown"
            onClick={this.props.onProfileEvent}
          >
            Manage Reports
          </NavLink>
        </div>
      );
    }
  };

  componentDidMount() {
    document.addEventListener("mouseup", this.props.onClickEvent);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.props.onClickEvent);
  }

  render() {
    return (
      /* Structure taken from
      https://www.w3schools.com/howto/howto_css_dropdown.asp
      */
      <div className="profileDropdown">
        <div className="link-container-dropdown">
          <NavLink
            to={"../profile/" + this.props.state.currentUser._id}
            className="link-dropdown"
            onClick={this.props.onProfileEvent}
          >
            Profile
          </NavLink>
        </div>
        <div className="link-container-dropdown">
          <NavLink
            to={"../messages"}
            className="link-dropdown"
            onClick={this.props.onProfileEvent}
          >
            Messages
          </NavLink>
        </div>
        {this.renderReviewTab()}
        <div className="link-container-dropdown">
          <NavLink
            to={"../login"}
            className="link-dropdown"
            onClick={() => {
              const environment = process.env.NODE_ENV === 'development' ?
                `http://localhost:${process.env.REACT_APP_PORT}` :
                '' ;

              fetch(environment + "/users/logout");
              this.props.setGlobalState({ currentUser: null });
              this.props.onProfileEvent();
            }}
          >
            Log Out
          </NavLink>
        </div>
      </div>
    );
  }
}

export default ProfileDropdown;
