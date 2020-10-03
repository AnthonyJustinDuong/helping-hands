import React from 'react';
import './styles.css';

class ChatBox extends React.Component {
  render() {
    return (
      <div className="chatBox" onClick={this.props.onClick}>
        <div className="chatBoxAvatar">
          <img src={this.props.avatar} alt={this.props.personName}/>
        </div>
        <div className="chatBoxBody">
          <p>{this.props.personName}</p>
        </div>
      </div>
    );
  }

}

export default ChatBox;
