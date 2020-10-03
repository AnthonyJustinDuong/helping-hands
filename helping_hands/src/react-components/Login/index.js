import React from "react";
import "./styles.css";
import { login } from "../../actions/user.js";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

/* Component for the Log In page */
class Login extends React.Component {
  state = {
    username: "",
    password: "",
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  attemptLogin = () => {
    login(this.state)
      .then((res) => {
        if (res) {
          this.props.setGlobalState({ currentUser: res.currentUser }, () => {
            this.props.history.push(
              "../profile/" + this.props.state.currentUser._id
            );
          });
        } else {
          alert("Username and password do not match.");
        }
      })
      .catch((err) => {
        alert("Unable to log in. Please try again later.");
      });
  };

  render() {
    return (
      <div className="login">
        <form id="loginForm">
          <h2>Log In</h2>
          <div id="usernameForm">
            <label htmlFor="username">Username</label> <br />
            <input
              type="text"
              name="username"
              onChange={this.handleInputChange}
              required
            />
          </div>
          <div id="passwordForm">
            <label htmlFor="password">Password</label> <br />
            <input
              type="password"
              name="password"
              onChange={this.handleInputChange}
              required
            />
          </div>
          <input
            id="loginButton"
            value="Log In"
            type="submit"
            onClick={(event) => {
              event.preventDefault();
              this.attemptLogin();
            }}
          />
        </form>
        <p><Link to="/sign-up">Not registered? Create an account.</Link></p>
      </div>
    );
  }
}

export default withRouter(Login);
