import React, { Component } from "react";
import Link, { navigateTo } from "gatsby-link";
import "./HomePostCard.scss";

class HomePostCard extends Component {
    render () {
        const post = this.props.post;
        return(
          <div role="presentation" className="post-card" onClick={() => navigateTo(post.path)}>
            <img alt="Post illustration" src={post.cover} />
            <div className="post-tags">
              {post.tags ? post.tags.map(tag => (
                <Link to={`/tags/${tag}`}><span className={`tag tag-${tag.replace(/ /g, '-')}`}>{tag}</span></Link>
                )) : ''
              }
            </div>
            <span className="post-title">{post.title}</span>
          </div>
        );
    }
}

export default HomePostCard;