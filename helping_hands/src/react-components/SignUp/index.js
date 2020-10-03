import React from "react";
import { uid } from "react-uid";
import {
  validateName,
  validateUsernamePattern,
  validateUniqueUsername,
  validateEmailPattern,
  validateUniqueEmail,
  validatePhoneNumber,
  validatePassword,
  validateConfirm,
} from "../../actions/formValidation.js";
import { registerUser } from "../../actions/user.js";
import { withRouter } from "react-router-dom";
import "./styles.css";

import { addImage } from "../../actions/image.js";

/* Component for the Log In page */
class SignUp extends React.Component {
  state = {
    firstName: "",
    firstNameErrs: [],
    showFirstNameErrs: false,
    lastName: "",
    lastNameErrs: [],
    showLastNameErrs: false,
    username: "",
    usernameErrs: [],
    showUsernameErrs: false,
    usernameTaken: false,
    password: "",
    passwordErrs: [],
    showPasswordErrs: false,
    confirmPassword: "",
    confirmPasswordErrs: [],
    showConfirmPasswordErrs: false,
    email: "",
    emailErrs: [],
    showEmailErrs: false,
    emailTaken: false,
    phoneNumber: "",
    phoneNumberErrs: [],
    showPhoneNumberErrs: false,
    streetAddress: "",
    city: "",
    province: "AB",
  };
  ref = React.createRef();

  formFields = [
    {
      name: "firstName",
      title: "First Name",
      type: "text",
      synchValidator: validateName,
    },
    {
      name: "lastName",
      title: "Last Name",
      type: "text",
      synchValidator: validateName,
    },
    {
      name: "username",
      title: "Username",
      type: "text",
      synchValidator: validateUsernamePattern,
      asynchValidator: validateUniqueUsername,
    },
    {
      name: "password",
      title: "Password",
      type: "password",
      synchValidator: validatePassword,
    },
    {
      name: "confirmPassword",
      title: "Confirm Password",
      type: "password",
      synchValidator: validateConfirm,
    },
    {
      name: "email",
      title: "E-mail",
      type: "email",
      synchValidator: validateEmailPattern,
      asynchValidator: validateUniqueEmail,
    },
    {
      name: "phoneNumber",
      title: "Phone Number",
      type: "tel",
      synchValidator: validatePhoneNumber,
    },
    {
      name: "streetAddress",
      title: "Street Address",
      type: "text",
      synchValidator: () => [],
    },
    {
      name: "city",
      title: "City",
      type: "text",
      synchValidator: () => [],
    },
    {
      name: "province",
      title: "Province or Territory",
      type: "select",
      synchValidator: () => [],
    },
  ];

  handleInputChange = (event) => {
    const { value, name } = event.target;

    const field = this.formFields.filter((field) => field.name === name)[0];
    if (field) {
      const showErrorName = `show${field.name[0].toUpperCase()}${field.name.slice(
        1
      )}Errs`; // get the name of the show error for this field

      // Only show field error if it has been touched before
      const { [showErrorName]: showFieldError } = this.state;
      !showFieldError && this.setState({ [showErrorName]: true });

      // Change the state to the input value and
      // Validate input will produce a list of errors
      if (name === "password") {
        this.setState({
          password: value,
          confirmPasswordErrs: validateConfirm(
            value,
            this.state.confirmPassword
          ),
          passwordErrs: validatePassword(value),
        });
      } else if (name === "confirmPassword") {
        this.setState({
          confirmPassword: value,
          confirmPasswordErrs: validateConfirm(value, this.state.password),
        });
      } else if (
        name === "streetAddress" ||
        name === "city" ||
        name === "province"
      ) {
        this.setState({ [name]: value });
      } else {
        const errorListName = `${field.name}Errs`;
        // Set the value of the field state and the errors for that value
        this.setState({
          [name]: value,
          [errorListName]: field.synchValidator(value), // synchronous check
        });

        // Asynchronous check to see if fields need to be unique
        if (name === "username" || name === "email") {
          if (value.length === 0) {
            this.setState({ [`${name}Taken`]: false });
          } else {
            field.asynchValidator(value).then((reason) => {
              this.setState({
                [`${name}Taken`]: reason === "taken",
              });
            });
          }
        }
      }
    }
  };

  submitForm = async (event) => {
    event.preventDefault();

    addImage(this.ref.current, this.state.username);

    if (this.state.usernameTaken) {
      alert("Unable to register. Please choose another username.");
      return;
    }

    if (this.state.emailTaken) {
      alert("Unable to register. Your email has already been registered.");
      return;
    }

    // Check if all fields were filled out
    let i = 0;
    for (; i < this.formFields.length; i++) {
      const { name, title } = this.formFields[i];
      if (this.state[name].length === 0) {
        alert(
          `Please fill out the ${title} field and all other fields before submitting.`
        );
        return;
      }
    }

    for (i = 0; i < this.formFields.length; i++) {
      const { name, title } = this.formFields[i];
      if (name === "streetAddress" || name === "city" || name === "province")
        continue;

      const errorListName = `${name}Errs`;
      if (this.state[errorListName].length !== 0) {
        alert(
          `Please resolve all errors for the ${title} field before submitting.`
        );
        return;
      }
    }

    // Get the addresses latitude and longitute
    const { streetAddress, city, province } = this.state;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${streetAddress},+${city},+${province}&key=${apiKey}`
    );

    if (response.status !== 200) {
      alert(
        "Address is invalid. Please make sure you have the correct street address, city and province."
      );
      return;
    }

    const json = await response.json();

    const {
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      email,
      phoneNumber,
    } = this.state;

    registerUser({
      firstName,
      lastName,
      username,
      password,
      confirmPassword,
      email,
      phoneNumber,
      streetAddress,
      city,
      province,
      location: json.results[0].geometry.location,
    })
      .then((res) => {
        if (res) {
          alert(
            "Registration was successful! You will now be asked to log in."
          );
          this.props.history.push("../login");
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  renderFields = () => {
    return this.formFields.map((field) => {
      const { name, title, type } = field;
      if (name === "province") {
        return (
          <div key={uid(name)}>
            <label htmlFor="province">{title}</label>
            <select name="province" onChange={this.handleInputChange}>
              <option value="AB">Alberta</option>
              <option value="BC">British Columbia</option>
              <option value="MB">Manitoba</option>
              <option value="NB">New Brunswick</option>
              <option value="NL">Newfoundland and Labrador</option>
              <option value="NS">Nova Scotia</option>
              <option value="ON">Ontario</option>
              <option value="PE">Prince Edward Island</option>
              <option value="QC">Quebec</option>
              <option value="SK">Saskatchewan</option>
              <option value="NT">Northwest Territories</option>
              <option value="NU">Nunavut</option>
              <option value="YT">Yukon</option>
            </select>
          </div>
        );
      }
      return (
        <div key={uid(name)}>
          <label htmlFor={name}>{title}</label>
          <input type={type} name={name} onChange={this.handleInputChange} />
          <ul className="errorList">{this.renderErrors(name)}</ul>
        </div>
      );
    });
  };

  renderErrors = (fieldName) => {
    if (fieldName === "streetAddress" || fieldName === "city") return;

    const errorListName = `${fieldName}Errs`; // get error list propert from field name
    const showErrorName = `show${fieldName[0].toUpperCase()}${fieldName.slice(
      1
    )}Errs`; // get show error property from fieldName
    if (!this.state[showErrorName]) return;

    let errors = this.state[errorListName];
    if (fieldName === "username" && this.state.usernameTaken) {
      errors = errors.concat(["Username is already taken"]);
    } else if (fieldName === "email" && this.state.emailTaken) {
      errors = errors.concat(["E-mail is already registered"]);
    }

    return errors.map((err) => <li key={uid(err)}>{err}</li>);
  };

  render() {
    return (
      <div className="signUp">
        <form id="signUpForm">
          <h2>Sign Up</h2>
          <p id="instruction">
            To register as a user, please fill out all fields in the form below.
            Then, when you're finished, submit the form by clicking the sign up
            button at the bottom.
          </p>

          {this.renderFields()}

          <form ref={this.ref}>
            <div>
              <label>Profile Picture</label>
              <input name="image" type="file" />
            </div>
          </form>

          <input
            id="signupButton"
            value="Sign Up"
            type="submit"
            onClick={(event) => {
              this.submitForm(event);
            }}
          />
        </form>
      </div>
    );
  }
}

export default withRouter(SignUp);
