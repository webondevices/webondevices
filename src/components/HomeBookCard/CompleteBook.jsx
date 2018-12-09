import React, { Component } from "react";
import "./CompleteBook.scss";

class CompleteBook extends Component {
  render() {
    return (
      <div>
        <div className="book-content">
          <div>
            <h2>Complete book</h2>
            <p className="highlighted-text">Learn all about programming electronics JavaScript and Node.js, all from the very basics.</p>
            <p>Build a smart talking plant, a motion sensing alarms, learn data logging, send SMS notifactions and many more!</p>
          </div>
          <div>
            <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="/js-electronics.png" />
          </div>
        </div>
        <p className="intermediate-copy"><strong>Get the print edition from Amazon for only $12.95 - £12.95:</strong></p>
        <div>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.com/dp/1790464919') }} type="button">Amazon.com</button>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.co.uk/dp/1790464919') }} type="button">Amazon.co.uk</button>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.de/dp/1790464919') }} type="button">Amazon.de</button>
          <button className="cta-button amazon-cta action" onClick={() => { window.open('https://www.amazon.fr/dp/1790464919') }} type="button">Amazon.fr</button>
        </div>
      </div>
    );
  }
}

export default CompleteBook;