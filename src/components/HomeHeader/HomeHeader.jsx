import React, { Component } from "react";
import "./HomeHeader.scss";

class HomeHeader extends Component {
    render () {
        return(
          <header className="home-header">
            <img className="home-header-logo" alt="Web on Devices logo" src="webondevices-logo.png" />
            <span className="home-header-title">Web on Devices</span>
            <span className="home-header-subtitle">Electronics Hacking with JavaScript and other Web Technologies</span>
          </header>
        );
    }
}

export default HomeHeader;