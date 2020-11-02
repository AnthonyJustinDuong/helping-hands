import React from 'react';
import { uid } from "react-uid";
import io from 'socket.io-client';
import { animateScroll } from "react-scroll";
import Input from '../HelpNeeded/Feed/Input';
import MessageBox from './MessageBox'
import ChatItem from './ChatItem'
import { sendMessage, getChatById } from '../../actions/chat.js';
import { getUserById, loggedIn } from '../../actions/user.js';
import './styles.css';

class Messages extends React.Component {
  state = {
    chatInfoList: [],
    currentChat: {
      _id: null,
      creator: null,
      otherChatter: null,
      title: "Select a chat on the left.",
    },
    currentLog: [],
    socket: io(process.env.REACT_APP_LOCAL_PATH)
  }

  onSendMessage = (content) => {
    const message = {
      sender: this.props.state.currentUser._id,
      content: content,
      date: Date.now()
    }
    // Calls function that calls server
    sendMessage(this.state.currentChat._id, message);
    const pkg = {message, chatId: this.state.currentChat._id}
    this.state.socket && this.state.socket.emit('message', pkg)
  };

  scrollToBottom = () => {
    animateScroll.scrollToBottom({
      containerId: "messagesBody"
    });
  }

  onClickChatItem = (chatId, chatTitle) => {
    if (this.state.currentChat._id === chatId) return;
    if (this.state.socket) {
      this.state.socket.emit("leave", this.state.currentChat._id);
      this.state.socket.emit("join", chatId);
    }

    getChatById(chatId)
      .then(chat => {
        const currentLog = chat.log;
        const currentChat = chat;
        currentChat.log = null;
        currentChat.title = chatTitle;
        this.setState({ currentLog, currentChat })
      });
  }

  renderChatItems = () => {
    if (this.state.chatInfoList.length === 0) {
      return (
        <p>No messages yet.</p>
      );
    }

    return this.state.chatInfoList.map(chatInfo =>
      <ChatItem
        key={chatInfo._id}
        avatar={require("../../assets/" + chatInfo.avatar)}
        personName={chatInfo.title}
        onClick={() => this.onClickChatItem(chatInfo._id, chatInfo.title)}
      />
    );
  }

  renderMessages = () =>
    this.state.currentLog.map(message =>
      <MessageBox
        key={uid(message)}
        position={(this.props.state.currentUser._id === message.sender ?
        "right" : "left")}
        content={message.content}
      />
    )

  componentDidMount() {
    const { currentUser } = this.props.state;
     if (!loggedIn(currentUser)) return;
     getUserById(currentUser._id, "chatRooms")
        .then(async user => {
          const chatList = await user.chatRooms.map(this.getChatInfo)
          Promise.all(chatList)
           .then(chatInfoList =>
             this.setState({ chatInfoList: chatInfoList.filter(chatInfo => chatInfo)})
           );
        })

    this.state.socket.on('message', message => {
      this.setState(
        { currentLog: this.state.currentLog.concat([message]) },
        this.scrollToBottom
      );
    });
  }

  getChatInfo = async chatId => {
    const { currentUser } = this.props.state;
    const chat = await getChatById(chatId, "creator otherChatter");

    if (!chat) return null;

    const other = await (chat.creator === currentUser._id
      ? getUserById(chat.otherChatter, "avatar+name")
      : getUserById(chat.creator, "avatar+name"));
    chat.title = other.name.first + " " + other.name.last;
    chat.avatar = other.avatar;
    return chat;
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  render() {
    if (loggedIn(this.props.state.currentUser)) {
      return (
        <div id="messagesComponent">
          <div id="chatListBox">
            <h2>Chats</h2>
            <div id="chatList">
              { this.renderChatItems() }
            </div>
          </div>

          <div id="messages">
            <div id="messagesHead">
              <h2>{ this.state.currentChat.title }</h2>
            </div>
            <div id="messagesBody">
              { this.renderMessages() }
            </div>
            <div ref={this.messagesEndRef} />
            <div id="messagesInput">
              <Input onPostEvent={this.onSendMessage} />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="notLoggedIn">
        <h1>Please log in to message other users.</h1>
      </div>
    );
  }

  componentWillUnmount() {
    this.state.socket && this.state.socket.disconnect(true);
  }
}

export default Messages;
