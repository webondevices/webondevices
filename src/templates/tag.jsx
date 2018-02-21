import React from "react";
import Helmet from "react-helmet";
import PostListing from "../components/PostListing/PostListing";
import config from "../../data/SiteConfig";
import "./post.scss";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import SubscriptionBar from "../components/SubscriptionBar/SubscriptionBar";
import HomeBookCard from "../components/HomeBookCard/HomeBookCard";
import FreeBook from "../components/HomeBookCard/FreeBook";
import CompleteBook from "../components/HomeBookCard/CompleteBook";
import PostHeader from "../components/PostHeader/PostHeader";

export default class TagTemplate extends React.Component {
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

  render() {
    const tag = this.props.pathContext.tag;
    const postEdges = this.props.data.allMarkdownRemark.edges;

    if (this.state.on) {
      document.body.classList.remove('lights-off');
    } else {
      document.body.classList.add('lights-off');
    }

    return (
      <div className="tag-container">
        <Helmet title={`Posts tagged as "${tag}" | ${config.siteTitle}`} />
        <PostHeader />
        <main className="tags-container">
          <PostListing postEdges={postEdges} />
        </main>
        <section className="index-main-card-area" id="subscription">

          <HomeBookCard>
            <FreeBook />
          </HomeBookCard>
          
          <HomeBookCard>
            <CompleteBook />
          </HomeBookCard>

        </section>

        <HomeFooter />
        <SubscriptionBar />
      </div>
    );
  }
}

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
            tags
            cover
            date
          }
        }
      }
    }
  }
`;
