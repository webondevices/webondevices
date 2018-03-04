import React, { Component } from "react";
import "./PostHeader.scss";

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
          <header className="post-header">
            <img onClick={this.switchLight} className="post-header-logo" alt="Web on Devices logo" src="/webondevices-logo.png" />
            <a className="post-back-button" href="/">&lt; Back</a>
          </header>
        );
    }
}

export default HomeHeader;