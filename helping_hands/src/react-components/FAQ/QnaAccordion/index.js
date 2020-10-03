import React from "react";
import "./styles.css";
import plusSign from "./plus.svg";
import minusSign from "./minus.svg"

/* The Accordion Component in the FAQ page */
class Accordion extends React.Component {
  constructor(props) {
  super(props)
  this.state = {
  	answer: "visible",
    toggleIcon: plusSign
    }
  }

  /* Sets answer to show or hide accordingly */
  handleAnswer = () => {
  	if (this.state.answer === "visible") {
  		this.setState({answer: "hidden"});
      this.setState({toggleIcon: minusSign})
  	}
  	else {
  		this.setState({answer: "visible"});
      this.setState({toggleIcon: plusSign})
  	}
  }

  render() {
  const {question, answer} = this.props;
  	return (
	  <div className="oneAccordion">
	    <div className="section" onClick= {this.handleAnswer}>
	      <p>{question}</p>
	      <img src={this.state.toggleIcon} alt="Toggle Icon" id="toggleIcon" />
	    </div>
	    <div className={this.state.answer}>
	      <p>{answer}</p>
	    </div>
	  </div>
    );
  }
}

export default Accordion;