import React from "react";
import "./styles.css";

/* Leader component */
class Leader extends React.Component {
  
  // opens the appropriate user profile according to their unique id
  openUserProfile = (event) => {
    const userClicked = event.target.value;
    console.log("Opening user profile: " + userClicked);
  }

  render() {
  	const {rank, ppic, name, points} = this.props;
  	return(
    	<tr className="leaderRow">
        <td>{rank}</td>
        <td>
          <img src={ppic} alt={name} />
          <button type="button" className="user" value={name}
          onClick={(e) => {this.openUserProfile(e);}}>{name}</button>
        </td>
        <td>{points}</td>
      </tr>
    );
  }
}

export default Leader
