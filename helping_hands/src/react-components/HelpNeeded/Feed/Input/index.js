import React from "react";
import { Editor, EditorState, ContentState, RichUtils } from "draft-js";
import { stateToHTML } from "draft-js-export-html";

import "./styles.css";
import "draft-js/dist/Draft.css";

import bold from "./bold.svg";
import italic from "./italic.svg";
import underline from "./underline.svg";
import list from "./unorderedlist.svg";
import number from "./orderedlist.svg";
import undo from "./undo.svg";
import redo from "./redo.svg";

class Input extends React.Component {
  state = {
    editorState: EditorState.createEmpty(),
  };

  onChange = (editorState) => {
    this.setState({ editorState });
  };

  handleKeyCommand = (keyCommand) => {
    const newEditorState = RichUtils.handleKeyCommand(
      this.state.editorState,
      keyCommand
    );
    if (newEditorState) {
      this.onChange(newEditorState);
    }
  };

  onBoldClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "BOLD")
      );
    }
  };

  onItalicClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "ITALIC")
      );
    }
  };

  onUnderlineClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(
        RichUtils.toggleInlineStyle(this.state.editorState, "UNDERLINE")
      );
    }
  };

  onUnorderedListClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(
        RichUtils.toggleBlockType(this.state.editorState, "unordered-list-item")
      );
    }
  };

  onOrderedListClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(
        RichUtils.toggleBlockType(this.state.editorState, "ordered-list-item")
      );
    }
  };

  onUndoClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(EditorState.undo(this.state.editorState));
    }
  };

  onRedoClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      this.onChange(EditorState.redo(this.state.editorState));
    }
  };

  showPlaceholder = () => {
    const contentState = this.state.editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() === "unstyled") {
        return true;
      }
    }
    return false;
  };

  render() {
    return (
      <div className="input">
        <div className={this.showPlaceholder() ? "" : "hide"}>
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            handleKeyCommand={this.handleKeyCommand}
            placeholder="Need help with something?"
            spellCheck
          />
        </div>
        <div className="footer">
          <div className="controls">
            <button
              className={
                this.state.editorState.getCurrentInlineStyle().has("BOLD")
                  ? "control selected"
                  : "control"
              }
              onMouseDown={this.onBoldClick}
            >
              <img className="icon" src={bold} alt="bold" />
            </button>
            <button
              className={
                this.state.editorState.getCurrentInlineStyle().has("ITALIC")
                  ? "control selected"
                  : "control"
              }
              onMouseDown={this.onItalicClick}
            >
              <img className="icon" src={italic} alt="italic" />
            </button>
            <button
              className={
                this.state.editorState.getCurrentInlineStyle().has("UNDERLINE")
                  ? "control selected"
                  : "control"
              }
              onMouseDown={this.onUnderlineClick}
            >
              <img className="icon" src={underline} alt="underline" />
            </button>
            <button
              className={
                RichUtils.getCurrentBlockType(this.state.editorState) ===
                "unordered-list-item"
                  ? "control selected"
                  : "control"
              }
              onMouseDown={this.onUnorderedListClick}
            >
              <img className="icon" src={list} alt="bullet list" />
            </button>
            <button
              className={
                RichUtils.getCurrentBlockType(this.state.editorState) ===
                "ordered-list-item"
                  ? "control selected"
                  : "control"
              }
              onMouseDown={this.onOrderedListClick}
            >
              <img className="icon" src={number} alt="number list" />
            </button>
            <button className="control" onMouseDown={this.onUndoClick}>
              <img className="icon" src={undo} alt="undo" />
            </button>
            <button className="control" onMouseDown={this.onRedoClick}>
              <img className="icon" src={redo} alt="redo" />
            </button>
          </div>
          <button
            className="blue active inline"
            onClick={() => {
              this.props.onPostEvent(
                stateToHTML(this.state.editorState.getCurrentContent())
              );
              this.onChange(
                EditorState.push(
                  this.state.editorState,
                  ContentState.createFromText(""),
                  "remove-range"
                )
              );
            }}
          >
            Post
          </button>
        </div>
      </div>
    );
  }
}

export default Input;
