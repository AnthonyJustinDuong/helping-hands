import React from "react";

class Achiev extends React.Component {
  render() {
    return (
	  <div className="achiev">
		<div className="achievIconContainer">
			<img className="achievIcon" src={require("../../../../assets/" + this.props.achiev.icon)}  alt={this.props.achiev.icon} />
		</div>
		<h1 className="achievTitle">{this.props.achiev.name}</h1> <br/>
		<p className="achievDescription">{this.props.achiev.description}</p>
	  </div>
    );
  }
}

export default Achiev;
