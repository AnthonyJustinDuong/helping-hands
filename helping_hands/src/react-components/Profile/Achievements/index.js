import React from "react";
import trophy from "../../../assets/trophy.png"
import Achiev from "./Achiev"
import { uid } from "react-uid";
import { getAchievements } from "../../../actions/achievements.js"
import { loggedIn } from "../../../actions/user.js"


class Achievements extends React.Component {
  state = {
    achievements: [],
  };

  getProfileAchievements = (user) => {
	if (loggedIn(user)) {
	  return(this.state.achievements.map((achiev) => (
		    <Achiev
				key={uid(achiev)}
				achiev={achiev}/>
	  )));
	}
	return [];
  }

  componentDidMount() {
    getAchievements(this.props.userId).then(achievements => this.setState({achievements}));
  }

  render() {
    return (
	  <div className="column">
		<div id="achievementIconContainer">
		  <img id="achievementIcon" src={trophy} alt="Icons made by Vectors Market from www.flaticon.com" />
  	    </div>
		<h1 className="profileHeader">Achievements</h1>
		<div>
		  {this.getProfileAchievements(this.props.user)}
		</div>
 	  </div>
    );
  }
}

export default Achievements;
