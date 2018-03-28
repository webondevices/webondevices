import React from "react";
import Helmet from "react-helmet";
import PostListing from "../components/PostListing/PostListing";
import HomeHeader from "../components/HomeHeader/HomeHeader";
import FreeBook from "../components/HomeBookCard/FreeBook";
import CompleteBook from "../components/HomeBookCard/CompleteBook";
import HomeBookCard from "../components/HomeBookCard/HomeBookCard";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import SubscriptionBar from "../components/SubscriptionBar/SubscriptionBar";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";

import "./index.scss";

class Index extends React.Component {
  render() {
    const postEdges = this.props.data.allMarkdownRemark.edges;

    return (
      <div className="index-container">
        <Helmet title={config.siteTitle} />
        <SEO postEdges={postEdges} />
        <HomeHeader />

        <main className="index-main-container">
          <section className="index-main-card-area" id="subscription">

            <HomeBookCard>
              <FreeBook />
            </HomeBookCard>
            
            <HomeBookCard>
              <CompleteBook />
            </HomeBookCard>

          </section>

          <h1 className="index-recent-posts-title">Recent posts</h1>

          <PostListing postEdges={postEdges} />

          <HomeFooter />

          <SubscriptionBar />

        </main>

      </div>
    );
  }
}

export default Index;

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: ASC }
    ) {
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
            slug
            display
          }
        }
      }
    }
  }
`;
