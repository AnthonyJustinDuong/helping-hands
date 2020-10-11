import React from "react";
import "./styles.css";

class FilterCity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      city: "Ottawa",
      users: this.props.users
    }
  }

  // changes city according to user input, server call needed here
  changeCityHandler = (e) => {
    e.preventDefault();
    const currCity = document.getElementById("changeCity").value;

    // If our input has a value
    if (currCity.value !== "") {
      this.setState({city: currCity});
      this.props.parentMethod(currCity);
    }
  }

  render() {
    return(
      <form>
        <h2 id="region">{this.state.city}, Canada</h2>
        <input id="changeCity" type="text" className="fcity" placeholder="City"/>
        <button id="changeCityButton" onClick={this.changeCityHandler}>Search</button>
      </form>
    );
  }
}
export default FilterCity
