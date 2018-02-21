import React, { Component } from "react";
import "./CompleteBook.scss";

class CompleteBook extends Component {
    render () {
        return(
          <div>
            <div className="book-content">
              <div>
                <h2>Complete Book</h2>
                <p className="highlighted-text">Learn all about programming electronics JavaScript and Node.js, all from the very basics.</p>
                <p>Build a smart talking plant, a motion sensing alarms, learn data logging, send SMS notifactions and many more!</p>
              </div>
              <div>
                <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="js-electronics.png" />
              </div>
            </div>
            <button className="cta-button amazon-cta action" onClick={() => {window.open('https://www.amazon.com/JavaScript-Electronics-Hardware-Prototyping-Node-js/dp/1548255521/ref=sr_1_1')}} type="button">Amazon.com</button>
            <button className="cta-button amazon-cta action" onClick={() => {window.open('https://www.amazon.co.uk/JavaScript-Electronics-Hardware-Prototyping-Node-js/dp/1548255521/ref=sr_1_1')}} type="button">Amazon.co.uk</button>
            <button className="cta-button amazon-cta action" onClick={() => {window.open('https://www.amazon.de/JavaScript-Electronics-Hardware-Prototyping-Node-js/dp/1548255521/ref=sr_1_1')}} type="button">Amazon.de</button>
            <button className="cta-button amazon-cta action" onClick={() => {window.open('https://www.amazon.fr/JavaScript-Electronics-Hardware-Prototyping-Node-js/dp/1548255521/ref=sr_1_1')}} type="button">Amazon.fr</button>
          </div>
        );
    }
}

export default CompleteBook;