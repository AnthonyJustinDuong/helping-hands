import React from "react";
import Post from "../Post";
import { getPost } from "../../actions/posts.js";
import { getAllReports } from "../../actions/report.js";
import "./styles.css";

class ReviewBoard extends React.Component {
  state = {
    reports: [],
  };

  componentDidMount() {
    getAllReports()
      .then((reports) => {
        this.setState({ reports: reports });
      })
      .then(() => {
        const requests = [];
        for (let i = 0; i < this.state.reports.length; i++) {
          requests.push(getPost(this.state.reports[i].post));
        }
        return Promise.all(requests);
      })
      .then((posts) => {
        const reports = this.state.reports;
        for (let i = 0; i < posts.length; i++) {
          reports[i].post = posts[i];
        }
        return reports;
      })
      .then((reports) => {
        this.setState({ reports: reports });
      });
  }

  renderReports = () => {
    this.state.reports.map((report) => (
      <div className="reported" key={report._id}>
        <div className="reportSummary">
          <p>This comment was made on the following post:</p>
          <span className="userReported"> {report.content} </span>
        </div>
        <Post
          onResolveEvent={() => {}}
          onBookmarkEvent={() => {}}
          onSelectEvent={() => {}}
          onContactEvent={() => {}}
          onRedirectEvent={() => {}}
          post={report.post}
          state={this.props.state}
        />
      </div>
    ));
  };

  render() {
    if (this.props.state.currentUser.accessLevel === "admin") {
      return (
        <div className="reviewBoard">
          <h1>Review Board</h1>
          <p>
            The following has been reported by other users of the site. Please
            review them and take the appropriate actions. This may include:
          </p>
          <ul>
            <li>blocking the user</li>
            <li>deleting the users post(s)</li>
          </ul>
          {this.renderReports()}
        </div>
      );
    }
    return (
      <div className="notAdmin">
        <h1>You must be an admin to see this page.</h1>
      </div>
    );
  }
}

export default ReviewBoard;
