import React from "react";
import "./styles.css";
import { Link } from "react-router-dom";
import { loggedIn } from "../../actions/user.js";

import graphic from "./home.jpg";

/* Component for the Home page */
class Home extends React.Component {
  render() {
    return (
      <div className="home">
        <div>
          <p className="header">Welcome!</p>
          <p className="about">
            <b>Helping Hands</b> is a platform designed to help elderly,
            immuno-compromised, or otherwise vulnerable groups during the
            COVID-19 pandemic. Because individuals in these groups are more at
            risk when going outside to buy groceries or run errands, our
            platform enables local volunteers to reach out and help complete
            these tasks for them.
          </p>
          <button>
            <Link
              to={
                loggedIn(this.props.state.currentUser)
                  ? "help-needed"
                  : "/login"
              }
            >
              Get Started
            </Link>
          </button>
        </div>
        <img src={graphic} alt="together" />
      </div>
    );
  }
}

export default Home;
