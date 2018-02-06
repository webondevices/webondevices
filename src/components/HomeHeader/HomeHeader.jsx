import React, { Component } from "react";
import "./HomeHeader.scss";

class HomeHeader extends Component {
    constructor () {
      super();
      this.state = {
        on: true
      };
      this.switchLight = this.switchLight.bind(this);
    }

    switchLight () {
      this.setState({on: !this.state.on});

      if (this.state.on) {
        document.body.classList.remove('lights-off');
      } else {
        document.body.classList.add('lights-off');
      }
    }

    render () {
        return(
          <header className="home-header">
            <img onClick={this.switchLight} className="home-header-logo" alt="Web on Devices logo" src="webondevices-logo.png" />
            <span className="home-header-title">Web on Devices</span>
            <span className="home-header-subtitle">Electronics Hacking with JavaScript and other Web Technologies</span>
          </header>
        );
    }
}

export default HomeHeader;