import React, { Component } from "react";
import { navigateTo } from "gatsby-link";
import "./HomePostCard.scss";
import Tags from "../Tags/Tags";

class HomePostCard extends Component {
    render () {
        const post = this.props.post;
        return(
          <div role="presentation" className="post-card">
            <div className="post-image" style={{'backgroundImage': `url(${post.cover})`}} onClick={() => navigateTo(post.path)} />
            {post.tags ? <Tags tags={post.tags} /> : ''}
            <span className="post-title" onClick={() => navigateTo(post.path)}>{post.title}</span>
          </div>
        );
    }
}

export default HomePostCard;