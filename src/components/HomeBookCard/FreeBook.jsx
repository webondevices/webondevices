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
      submitted: localStorage.getItem('submitted') !== null,
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
          localStorage.setItem('submitted', true);
        
          // Server error
        } else {  
          this.setState({submitted: false, pending: false, error: true});
        }
      };

      request.onerror = () => {
        this.setState({submitted: false, pending: false, error: true});
      };

      request.send();
      this.setState({pending: true});
      
    }
  }

  render () {
      return(
        <div className="book-content">
          <div>
            <h2>Free Ebook</h2>
            <p className="highlighted-text">Learn hardware prototyping and become a better developer.</p>
            <p>This ebook will get you started with JavaScript Arduino electronics in no time.</p>
            <form className={`email-form${this.state.submitted ? ' submitted' : ''}${this.state.pending ? ' pending' : ''}${this.state.error ? ' error' : ''}${this.state.valid ? ' valid' : ' invalid'}`}>
              <input type="email" placeholder="Email address" onChange={this.handleInput} />
              <p className="pending-message">Submitting...</p>
              <p className="error-message">Please try again!</p>
              <button className="cta-button action" onClick={this.submit} type="submit">Send me the PDF</button>
            </form>
            <p className="thank-you-message">Check your emails!</p>
          </div>
          <div>
            <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="intro-to-js-electronics.png" />
          </div>
        </div>
      );
  }
}

export default FreeBook;