import React, { Component } from "react";
import "./FreeBook.scss";

class FreeBook extends Component {

  static isValidEmail (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  constructor () {
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

  handleInput (event) {
    this.setState({
      email: event.target.value,
      valid: FreeBook.isValidEmail(event.target.value),
      error: false
    });
  }

  submit (event) {
    event.preventDefault();

    if (this.state.valid) {
      const request = new XMLHttpRequest();
      request.open('GET', `${this.apiEndpoint}?email=${this.state.email}`, true);

      request.onload = () => {
        
        // Successfully submitted
        if (request.status === 200) {
          this.setState({submitted: true});
        
        // Server error
        } else {  
          this.setState({pending: false, submitted: false, error: true});
        }
      };

      request.onerror = () => {
        this.setState({pending: false, submitted: false, error: true});
      };

      request.send();
      this.setState({pending: true});
      
    }
  }

  render () {
      return(
        <div>
          <div className="book-content">
            <div>
              <h2>Free Ebook</h2>
              <p className="highlighted-text">Get started with hardware prototyping and learn the basiscs in a few hours.</p>
              <p>This ebook will introduce you to JavaScript Arduino Electronics: blink an LED light and read simple sensors!</p>
            </div>
            <div>
              <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="/intro-to-js-electronics.png" />
            </div>
          </div>
          <form className={`email-form${this.state.submitted ? ' submitted' : ''}${this.state.pending ? ' pending' : ''}${this.state.error ? ' error' : ''}${this.state.valid ? ' valid' : ' invalid'}`}>
            <input type="email" placeholder="Email address" onChange={this.handleInput} />
            <p className="pending-message">Submitting...</p>
            <p className="error-message">Please try again!</p>
            <button className="cta-button submit-email action" onClick={this.submit} type="submit">Send me the PDF</button>
          </form>
          <p className="thank-you-message">Check your emails!</p>
        </div>
      );
  }
}

export default FreeBook;