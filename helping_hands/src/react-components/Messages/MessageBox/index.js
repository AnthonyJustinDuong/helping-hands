import React from 'react';
import './styles.css';

class MessageBox extends React.Component {
  render() {
    return (
      <div className="messageBox">
        <div className={ this.props.position }>
          <span className="messageText"
            dangerouslySetInnerHTML={{ __html: this.props.content }}>
          </span>
        </div>
      </div>
    );
  }
}

export default MessageBox;
