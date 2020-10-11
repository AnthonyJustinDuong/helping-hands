import React from "react";
import Leader from "./Leader";
import FilterCity from "./FilterCity";
import "./styles.css";
// import { withRouter } from "react-router-dom";

/* Leaderboard Table component */
class LeaderTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      city: "Toronto",
      leaders: [],
    }
  }

  // sets the data for the selected city
  changeCity = (city) => {
    this.setState({city: city});
  }

  //

  componentDidMount() {
    const environment = process.env.NODE_ENV === 'development' ?
      `http://localhost:${process.env.REACT_APP_PORT}` :
      '' ;

    const url = environment + `/leaderboards/${this.state.city}`;

    fetch(url)
      .then(res => {
        if (res.status === 200) return res.json();
      })
      .then(leaders => {
        // sort the leaders according to points
        leaders.sort(function(a, b) {
          return parseFloat(a.points) - parseFloat(b.points);
        });
        this.setState({ leaders: [leaders] });
      })
  }

  render() {
    return(
      <div className="leaderboardTable">
      	<FilterCity parentMethod={this.changeCity}/>
      	<table className="LeaderTable">
      	  <thead>
      	    <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
          	{this.state.leaders.map((item, index) =>
          	  <Leader key={index} rank={index + 1} ppic={item.ppic}
                name={item.name} points={item.points} />)
            }
          </tbody>
        </table>
      </div>
  		);
  }
}
export default LeaderTable
//export default withRouter(LeaderTable);
