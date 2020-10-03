import React from "react";
import { uid } from "react-uid";
import Post from "../../../Post";

class Posts extends React.Component {
  render() {
    return (
      <div>
        {this.props.posts.map((post) => (
          <Post
            key={uid(post)}
            onDeleteEvent={this.props.onDeleteEvent}
            onResolveEvent={this.props.onResolveEvent}
            onBookmarkEvent={this.props.onBookmarkEvent}
            onSelectEvent={this.props.onSelectEvent}
            onContactEvent={this.props.onContactEvent}
            onRedirectEvent={this.props.onRedirectEvent}
            post={post}
            state={this.props.state}
          />
        ))}
      </div>
    );
  }
}

export default Posts;
