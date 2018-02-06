import React, { Component } from "react";

class CompleteBook extends Component {
    render () {
        return(
          <div className="book-content">
            <div>
              <h2>Complete Book</h2>
              <p className="highlighted-text">Learn hardware prototyping and become a better developer.</p>
              <p>This ebook will get you started with JavaScript Arduino electronics in no time. This ebook will get you started with JavaScript Arduino electronics in no time.</p>
              <button className="cta-button action" type="submit">Buy on Amazon</button>
            </div>
            <div>
              <img className="index-card-book" alt="Introduction to JavaScript Electronics" src="js-electronics.png" />
            </div>
          </div>
        );
    }
}

export default CompleteBook;