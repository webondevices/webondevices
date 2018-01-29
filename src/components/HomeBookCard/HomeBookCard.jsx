import React, { Component } from "react";
import "./HomeBookCard.scss";

class HomeBookCard extends Component {
    render () {
        return(
          <div className="index-card">
            {this.props.children}
          </div>
        );
    }
}

export default HomeBookCard;