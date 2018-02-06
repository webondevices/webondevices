import React, { Component } from "react";
import "./SubscriptionBar.scss";

class SubscriptionBar extends Component {
    offset (el) {
        const rect = el.getBoundingClientRect();
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
    }
    scrollTo () {
        const offset = this.offset(document.getElementById('subscription'));
        window.scrollTo(offset);
    }
    render () {
        return(
          <div className="subscription-bar">
            <span className="more-info-label">Get started with JavaScript Electronics for FREE</span>
            <button className="cta-button more-info-button" type="" onClick={() => this.scrollTo()}>More Info</button>
          </div>
        );
    }
}

export default SubscriptionBar;