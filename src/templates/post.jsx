import React from "react";
import Helmet from "react-helmet";
import UserInfo from "../components/UserInfo/UserInfo";
import Disqus from "../components/Disqus/Disqus";
import PostTags from "../components/PostTags/PostTags";
import SocialLinks from "../components/SocialLinks/SocialLinks";
import SEO from "../components/SEO/SEO";
import config from "../../data/SiteConfig";
import "./b16-tomorrow-dark.scss";
import "./post.scss";
import HomeFooter from "../components/HomeFooter/HomeFooter";
import SubscriptionBar from "../components/SubscriptionBar/SubscriptionBar";
import HomeBookCard from "../components/HomeBookCard/HomeBookCard";
import FreeBook from "../components/HomeBookCard/FreeBook";
import CompleteBook from "../components/HomeBookCard/CompleteBook";
import PostHeader from "../components/PostHeader/PostHeader";

export default class PostTemplate extends React.Component {
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
    const { slug } = this.props.pathContext;
    const postNode = this.props.data.markdownRemark;
    const post = postNode.frontmatter;
    if (!post.id) {
      post.id = slug;
    }
    if (!post.category_id) {
      post.category_id = config.postDefaultCategoryID;
    }

    if (this.state.on) {
      document.body.classList.remove('lights-off');
    } else {
      document.body.classList.add('lights-off');
    }
    return (
      <div>
        <Helmet>
          <title>{`${post.title} | ${config.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <PostHeader />
        <main className="post-container">
          <h1>{post.title}</h1>
          <article dangerouslySetInnerHTML={{ __html: postNode.html }} />
          <div className="post-meta">
            <PostTags tags={post.tags} />
            <SocialLinks postPath={slug} postNode={postNode} />
          </div>
          <UserInfo config={config} />
          <Disqus postNode={postNode} />
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
  query BlogPostBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      timeToRead
      excerpt
      frontmatter {
        title
        cover
        date
        category
        tags
      }
      fields {
        slug
      }
    }
  }
`;
