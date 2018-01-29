import React, { Component } from "react";
import "./FreeBook.scss";

class FreeBook extends Component {
    render () {
        return(
          <div className="book-content">
            <div>
              <h2>Free Ebook</h2>
              <p className="highlighted-text">Learn hardware prototyping and become a better developer.</p>
              <p>This ebook will get you started with JavaScript Arduino electronics in no time.</p>
              <form>
                <input type="email" placeholder="Email address" />
                <button className="action" type="submit">Send me the PDF</button>
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