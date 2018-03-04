import React, { Component } from "react";
import Link from "gatsby-link";
import "./Tags.scss";

class Tags extends Component {
    render () {
        return(
          <div className="post-tags">
            {this.props.tags ? this.props.tags.map((tag, i) => (
              <Link key={i} to={`/tags/${tag}`}><span className={`post-tag tag-${tag.replace(/ /g, '-')}`}>{tag}</span></Link>
            )) : ''}
          </div>
        );
    }
}

export default Tags;