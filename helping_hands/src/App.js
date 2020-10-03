import React from "react";
import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";

import Navigation from "./react-components/Navigation";
import Home from "./react-components/Home";
import HelpNeeded from "./react-components/HelpNeeded";
import FAQ from "./react-components/FAQ";
import Leaderboard from "./react-components/Leaderboard";
import Profile from "./react-components/Profile";
import Login from "./react-components/Login";
import SignUp from "./react-components/SignUp";
import Messages from "./react-components/Messages";
import ReviewBoard from "./react-components/ReviewBoard";

class App extends React.Component {
  state = {
    currentUser: null,
  };

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Navigation
            state={this.state}
            setGlobalState={(propertyChange, callback) => {
              this.setState(propertyChange, callback);
            }}
          />

          <Switch>
            <Route
              exact
              path="/"
              render={() => <Home state={this.state} />}
            />
            <Route
              exact
              path="/help-needed"
              render={() => <HelpNeeded state={this.state} />}
            />
            <Route exact path="/faq" render={() => <FAQ />} />
            <Route exact path="/leaderboard" render={() => <Leaderboard />} />
            <Route
              path="/profile"
              render={() => <Profile state={this.state}
                  setGlobalState={(propertyChange, callback) => {
                  this.setState(propertyChange, callback);
                }}/>}
            />
            <Route
              exact
              path="/login"
              render={() => (
                <Login
                  state={this.state}
                  setGlobalState={(propertyChange, callback) => {
                    this.setState(propertyChange, callback);
                  }}
                />
              )}
            />
            <Route
              exact
              path="/sign-up"
              render={() => <SignUp />}
            />
            <Route
              exact
              path="/messages"
              render={() => <Messages state={this.state} />}
            />
            <Route
              exact
              path="/review-board"
              render={() => <ReviewBoard state={this.state} />}
            />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
