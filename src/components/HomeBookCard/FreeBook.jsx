import React, { Component } from "react";
import "./FreeBook.scss";

class FreeBook extends Component {

  static isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  constructor() {
    super();
    this.state = {
      email: '',
      valid: false,
      submitted: false,
      pending: false,
      error: false
    };

    this.apiEndpoint = 'https://9auqx2dbeh.execute-api.us-east-1.amazonaws.com/prod/handle-emails/';

    this.handleInput = this.handleInput.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleInput(event) {
    this.setState({
      email: event.target.value,
      valid: FreeBook.isValidEmail(event.target.value),
      error: false
    });
  }

  submit(event) {
    event.preventDefault();

    if (this.state.valid) {
      const request = new XMLHttpRequest();
      request.open('GET', `${this.apiEndpoint}?email=${this.state.email}`, true);

      request.onload = () => {

        // Successfully submitted
        if (request.status === 200) {
          this.setState({ submitted: true });

          // Server error
        } else {
          this.setState({ pending: false, submitted: false, error: true });
        }
      };

      request.onerror = () => {
        this.setState({ pending: false, submitted: false, error: true });
      };

      request.send();
      this.setState({ pending: true });

    }
  }

  render() {
    return (
      <div>
        <div className="book-content">
          <div>
            <h2>Introduction</h2>
            <p className="highlighted-text">Get started with JavaScript Electronics and learn the basiscs in just a few hours!</p>
            <p>Learn working with the Arduino UNO, building simple circuits, controlling an LED light and measuring light and temperature with JavaScript and Node.js!</p>
          </div>
          <div>
            <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="/intro-to-js-electronics.png" />
          </div>
        </div>
        <p className="intermediate-copy"><strong>Get the print edition from Amazon for only<br />$4.95 - £4.95:</strong></p>
        <div>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.com/dp/1790516900') }} type="button">Amazon.com</button>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.co.uk/dp/1790516900') }} type="button">Amazon.co.uk</button>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.de/dp/1790516900') }} type="button">Amazon.de</button>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.fr/dp/1790516900') }} type="button">Amazon.fr</button>
        </div>
      </div>
    );
  }
}

export default FreeBook;