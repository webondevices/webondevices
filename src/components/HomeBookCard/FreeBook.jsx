import React, { Component } from "react";
import "./FreeBook.scss";

class FreeBook extends Component {
    constructor () {
      super();
      this.state = {
        email: '',
        valid: false,
        submitted: false,
      };

      this.handleInput = this.handleInput.bind(this);
      this.submit = this.submit.bind(this);
    }

    isValidEmail (email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    }

    handleInput (event) {
      this.setState({
        email: event.target.value,
        valid: this.isValidEmail(event.target.value)
      });
    }

    submit (event) {
      event.preventDefault();

      if (this.state.valid) {
        // submit
        this.setState({submitted: true});
      }
    }

    render () {
        return(
          <div className="book-content">
            <div>
              <h2>Free Ebook</h2>
              <p className="highlighted-text">Learn hardware prototyping and become a better developer.</p>
              <p>This ebook will get you started with JavaScript Arduino electronics in no time.</p>
              <form className={`email-form ${this.state.submitted ? 'submitted' : ''}`}>
                <input type="email" placeholder="Email address" onChange={this.handleInput} />
                <button className={`${this.state.valid ? 'valid' : 'invalid'} cta-button action`} onClick={this.submit} type="submit">Send me the PDF</button>
              </form>
            </div>
            <div>
              <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="intro-to-js-electronics.png" />
            </div>
          </div>
        );
    }
}

export default FreeBook;