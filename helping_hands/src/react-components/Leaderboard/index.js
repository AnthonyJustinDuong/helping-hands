import React from "react";
import "./styles.css";
import LeaderTable from "./LeaderTable/index.js";

/* Component for the Leaderboard page */
class Leaderboard extends React.Component {
  render() {
  	return (
      <div className="leaderboard">
        <LeaderTable />
        <p id="pointSystem">*10 points = 1 Request Fulfilled. <br />
        Bonus points possible. See the FAQ page for more details*</p>
      </div>
    );
  }
}

export default Leaderboard;
