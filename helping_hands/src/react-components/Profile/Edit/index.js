import React from "react";
import { uid } from "react-uid";
import { modifyPassword, modifyEmail, modifyPhoneNumber } from "../../../actions/user.js";
import {validatePassword, validateUniqueEmail, validateEmailPattern,
  validatePhoneNumber } from "../../../actions/formValidation.js";
import "./styles.css"

class Edit extends React.Component {

  state = {
    password: "",
    passwordErrors: [],
    confirmPassword: "",
    confirmInputTouched: false,
    email: "",
    phoneNumber: ""
  };

  handleInputChange = event => {
    const value = event.target.value;
    const name = event.target.name;

    switch (name) {
      case "password":
        this.setState({passwordErrors: validatePassword(value)});
        break;
      case "confirmPassword":
        this.setState({confirmInputTouched: true});
        break;
      default:
        break;
    }

    this.setState({
      [name]: value
    });
  };

  editPassword() {
    if (this.state.password !== this.state.confirmPassword) {
		alert("Passwords do not match.");
		return;
	}
    const errors = validatePassword(this.state.password);
    if (errors.length === 0) {
	   modifyPassword(this.props.userId, this.state.password, this.state.confirmPassword)
     .then(res => {
       if (res) {
         alert("Password changed successfully. You will now be asked to log in again.");
         this.props.setGlobalState({currentUser: null});
         this.props.history.push("../login");
       } else {
         alert("An error occured while changing your password.");
       }
     })
     .catch(err => alert("Unsuccessful due to:\n" + err));
	}
	else {
		alert("Error: " + errors);
	}
  }

  editEmail() {
    const email = this.state.email;
    modifyEmail(this.props.userId, email)
    .then(res => {
      if (res) {
        alert("Email changed successfully to " + email);
		  // Figure out how to clear fields
		// this.setState({email: ""}, () => console.log(this.state.email));
      }
	  else {
		alert("An error occured while changing your email");
	  }
    })
    .catch(err => alert("Unsuccessful due to:\n" + err))

  }

  editPhoneNumber() {    
    if (validatePhoneNumber(this.state.phoneNumber)) {
		const phoneNumber = this.state.phoneNumber;
		modifyPhoneNumber(this.props.userId, phoneNumber)
		.then(res => {
		  if (res) {
			alert("Phone number changed successfully to " + phoneNumber);
		  // Figure out how to clear fields
		  // this.setState({phoneNumber: ""});
		  }
		  else {
			alert("An error occured while changing your phone number");
		  }
		})
		.catch(err => {
		  alert(err);
		})
	}
	else {
	  alert("Invalid phone number")
	}
  }
  
  renderPasswordErrors() {
    return (
      <ul id="passwordErrors">
        {this.state.passwordErrors.map(err => <li key={uid(err)}>{err}</li>)}
      </ul>
    );
  }

  renderConfirmPasswordError() {
    if (this.state.confirmInputTouched && this.state.password !== this.state.confirmPassword)
      return (
        <ul id="confirmPasswordError">
          <li>Passwords do not match</li>
        </ul>
      );
    return;
  }

  render() {
    return (
		<div className="column">
		  <h1 className="profileHeader">User settings</h1>
		  <h2>Change password</h2>
		  <form>
  			<input type="text" name="password" placeholder="Enter new password" onChange={this.handleInputChange}/>
          { this.renderPasswordErrors() }
  			<input type="text" name="confirmPassword" placeholder="Confirm new password" onChange={this.handleInputChange}/>
          { this.renderConfirmPasswordError() }
        <input className="settingsButton" type="submit" value="Submit"
  				onClick={(event) => {event.preventDefault(); this.editPassword()}} />
		  </form>

		  <br />
		  <h2>Change e-mail</h2>
		  <form>
			<label>
			<input type="text" name="email" placeholder="Enter new e-mail" onChange={this.handleInputChange}/>
			</label>
			<input className="settingsButton" type="submit" value="Submit"
				onClick={(event) => {event.preventDefault(); this.editEmail()}}/>
		  </form>

		  <br />
		  <h2>Change phone number</h2>
		  <form>
			<label>
			<input type="text" name="phoneNumber" placeholder="Enter new number" onChange={this.handleInputChange}/>
			</label>
			<input className="settingsButton" type="submit" value="Submit"
				onClick={(event) => {event.preventDefault(); this.editPhoneNumber()}}/>
		  </form>
		</div>
    );
  }
}

export default Edit;
