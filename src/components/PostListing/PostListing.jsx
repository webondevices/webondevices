import React from "react";
import moment from "moment";
import HomePostCard from "../HomePostCard/HomePostCard";
import "./PostListing.scss";

class PostListing extends React.Component {
  getPostList() {
    let postList = [];
    this.props.postEdges.forEach(postEdge => {
      postList.push({
        path: postEdge.node.frontmatter.slug,
        tags: postEdge.node.frontmatter.tags,
        cover: postEdge.node.frontmatter.cover,
        title: postEdge.node.frontmatter.title,
        date: postEdge.node.frontmatter.date,
        excerpt: postEdge.node.excerpt,
        timeToRead: postEdge.node.timeToRead
      });
    });

    postList = postList.sort((a, b) => {
      const dateA = moment(a.date, 'DD-MM-YYYY');
      const dateB = moment(b.date, 'DD-MM-YYYY');

      if (dateA.isBefore(dateB)) return 1;
      if (dateB.isBefore(dateA)) return -1;
      
      return 0;
    });

    return postList;
  }
  render() {
    const postList = this.getPostList();
    return (
      <section className="post-listing-cards">
        {postList.map(post => (
          <HomePostCard post={post} />
        ))}
      </section>
    );
  }
}

export default PostListing;
