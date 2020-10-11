import React from 'react';
import { uid } from "react-uid";
import { GoogleMap, LoadScript, MarkerClusterer, TrafficLayer } from '@react-google-maps/api';
import ClickableMarker from './ClickableMarker';

import { getUserById } from "../../../actions/user.js";

class MapContainer extends React.Component {
  state = {
    posts: [],
  }

  findPostLocation = targetPostId => {
    const targetPost = this.state.posts.filter(post => post._id === targetPostId)[0];
    if (targetPost) {
      return targetPost.location;
    }
    return this.props.userLoc;
  }

  markerOpacity = postId => {
    return (this.props.selected === postId ? 1 : 0.5);
  }

  renderMarkers = clusterer => {
    return (this.state.posts.map(post => {
      return (
        <ClickableMarker
          key={post._id}
          postId={post._id}
          position={post.location}
          title={post.userName}
          clusterer={clusterer}
          setSelectedPost={this.props.setSelectedPost}
          opacity={this.markerOpacity(post._id)}
        />
      );
    }));
  }

  componentDidUpdate(prevProps) {
    if (this.props.posts !== prevProps.posts) {
      const postsModified = this.props.posts.map(post => {
        const postModified = {
          ...post
        }

        return getUserById(post.author, "location+name").then(user => {
          postModified.location = user.location;
          postModified.userName = user.name.first + " " + user.name.last;
          return postModified;
        });
      });

      Promise.all(postsModified).then(posts => {
        this.setState({posts});
      })
    }
  }

  render() {
    console.log("render called in MapContainer, process.env: ", process.env);
    const containerStyle = {
      width: '100%',
      height: '100%'
    };

    const clusterOptions = {
      imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m"
    };

    return (
      <LoadScript
        googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={this.findPostLocation(this.props.selected)}
          zoom={this.props.zoom}
        >
          <MarkerClusterer
            maxZoom={15}
            options={clusterOptions}>
            { clusterer => this.renderMarkers(clusterer) }
          </MarkerClusterer>
          <TrafficLayer/>
        </GoogleMap>
      </LoadScript>
    );
  }
}

export default MapContainer;
