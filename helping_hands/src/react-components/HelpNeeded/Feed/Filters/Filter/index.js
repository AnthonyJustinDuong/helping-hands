import React, { Component } from "react";
import "./styles.css";

class Filter extends Component {
  render() {
    return (
      <button
        className={
          this.props.filter === this.props.type ? "filter selected" : "filter"
        }
        onClick={() => {
          this.props.onFilterEvent(this.props.type);
        }}
      >
        {this.props.text}
      </button>
    );
  }
}

export default Filter;
