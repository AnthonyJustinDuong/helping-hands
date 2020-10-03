import React from "react";
import Filter from "./Filter";

import "./styles.css";

import { loggedIn } from "../../../../actions/user.js";

class Filters extends React.Component {
  render() {
    return (
      <div className="filters">
        <Filter
          type="NEWEST"
          text="Newest"
          filter={this.props.filter}
          onFilterEvent={this.props.onFilterEvent}
        />
        <Filter
          type="OLDEST"
          text="Oldest"
          filter={this.props.filter}
          onFilterEvent={this.props.onFilterEvent}
        />
        <Filter
          type="FULFILLED"
          text="Fulfilled"
          filter={this.props.filter}
          onFilterEvent={this.props.onFilterEvent}
        />
        <Filter
          type="UNFULFILLED"
          text="Unfulfilled"
          filter={this.props.filter}
          onFilterEvent={this.props.onFilterEvent}
        />
        {loggedIn(this.props.state.currentUser) && (
          <Filter
            type="BOOKMARKED"
            text="Bookmarked"
            filter={this.props.filter}
            onFilterEvent={this.props.onFilterEvent}
          />
        )}
      </div>
    );
  }
}

export default Filters;
