import React from "react";
import Input from "./Input";
import Posts from "./Posts";
import Filters from "./Filters";
import "./styles.css";
import Placeholder from "./Placeholder";
import { loggedIn } from "../../../actions/user.js";

class Feed extends React.Component {
  render() {
    return (
      <div className="feed">
        {loggedIn(this.props.state.currentUser) ? (
          <Input onPostEvent={this.props.onPostEvent} />
        ) : (
          <Placeholder />
        )}
        <Filters
          state={this.props.state}
          onFilterEvent={this.props.onFilterEvent}
          filter={this.props.filter}
        />
        <Posts
          state={this.props.state}
          onDeleteEvent={this.props.onDeleteEvent}
          onResolveEvent={this.props.onResolveEvent}
          onBookmarkEvent={this.props.onBookmarkEvent}
          onSelectEvent={this.props.onSelectEvent}
          onContactEvent={this.props.onContactEvent}
          onRedirectEvent={this.props.onRedirectEvent}
          posts={this.props.posts}
        />
      </div>
    );
  }
}

export default Feed;
