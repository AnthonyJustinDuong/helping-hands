import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';

class ClickableMarker extends React.Component {
  state = {
    showInfo: true,
  }

  onMarkerClick = (event) => {
    this.props.setSelectedPost(this.props.postId);
    this.setState({
      showInfo: true
    })
  }

  infoWindow = () => {
    if (this.state.showInfo) {
      return (
        <InfoWindow
          onCloseClick={() => this.setState({showInfo: false})}
        >
          <div>
            {this.props.title}
          </div>
        </InfoWindow>
      );
    }
  }

  render() {
    return (
      <Marker
        position={this.props.position}
        title={this.props.title}
        clusterer={this.props.clusterer}
        opacity={this.props.opacity}
        onClick={this.onMarkerClick}
      >
        { this.infoWindow() }
      </Marker>
    );
  }
}

export default ClickableMarker;
