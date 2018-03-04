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
    }

    render () {
        // if (this.state.on) {
        //   this.window.document.body.classList.remove('lights-off');
        // } else {
        //   this.window.document.body.classList.add('lights-off');
        // }

        return(
          <header className="home-header">
            <img onClick={this.switchLight} className="home-header-logo" alt="Web on Devices logo" src="/webondevices-logo.png" />
            <span className="home-header-title">Web on Devices</span>
            <span className="home-header-subtitle">Electronics Hacking with JavaScript and other Web Technologies</span>
          </header>
        );
    }
}

export default HomeHeader;