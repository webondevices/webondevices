import React, { Component } from "react";
import "./HomeFooter.scss";

class HomeFooter extends Component {
    render () {
        return(
          <footer className="sub-bar-active">
            <section className="footer-about-us">
              <div className="footer-light-bulb"><img src="/webondevices-logo.png" alt="light bulb logo" /></div>
              <h2 className="footer-title">Web on Devices</h2>
              <p className="footer-main-message">Electronics Hacking with Javascript<br />and other Web Technologies</p>
              <a className="connect twitter" rel="noopener noreferrer" target="_blank" href="https://twitter.com/web_on_devices">Twitter</a>
              <a className="connect facebook" rel="noopener noreferrer" target="_blank" href="https://www.facebook.com/webondevices">Facebook</a>
            </section>

            <section className="about-author">
              <img className="author" src="/matemarschalko.jpg" alt="Mate Marschalko" />
              <h2>Mate Marschalko</h2>
              <p className="about-me">Web Developer, Creative Technologist and Maker. Builds Internet connected devices for the Internet of Things.</p>
            </section>

            <section className="legal">
              All rights reserved | Contact at <a href="emailto: hello@webondevices.com">hello@webondevices.com</a>
            </section>
          </footer>
        );
    }
}

export default HomeFooter;