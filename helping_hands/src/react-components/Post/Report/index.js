import React from "react";
import "./styles.css";

import close from "./close.svg";

import { addReport, getAllReportsForUser } from "../../../actions/report.js";

class Report extends React.Component {
  state = {
    reports: [],
  };

  componentDidMount() {
    getAllReportsForUser(this.props.state.currentUser._id).then((reports) => {
      this.setState({ reports: reports });
    });
  }

  render() {
    if (
      this.state.reports.reduce(
        (canReport, report) => canReport && this.props.post._id !== report.post,
        true
      )
    ) {
      return (
        <div className="overlay-background">
          <div className="report">
            <h2>Report</h2>
            <img
              className="close"
              src={close}
              alt="close"
              onClick={this.props.onReportEvent}
            />
            <p>Help us understand why you are reporting this post.</p>
            <div>
              <div
                className="input-box"
                contentEditable
                placeholder="E.g. inappropriate content, misuse, spam, etc..."
              ></div>
              <button
                className="blue active"
                onClick={(e) => {
                  addReport(
                    this.props.state.currentUser._id,
                    this.props.post._id,
                    e.target.parentElement.firstElementChild.innerText
                  ).then(() => {
                    this.props.onReportEvent();
                  });
                }}
              >
                Report
              </button>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="overlay-background">
        <div className="report">
          <h2>Report</h2>
          <img
            className="close"
            src={close}
            alt="close"
            onClick={this.props.onReportEvent}
          />
          <p>You have already reported this post.</p>
        </div>
      </div>
    );
  }
}

export default Report;
