import React, { Component } from "react";
import config from "../../../data/SiteConfig";

class Disqus extends Component {
  componentDidMount () {
    const {postNode} = this.props;
    const url = config.siteUrl + postNode.fields.slug;
    const post = postNode.frontmatter;

    window.disqus_config = function () {
      this.page.url = url;
      this.page.identifier = post.title;
    };
  
    (function() {  // REQUIRED CONFIGURATION VARIABLE: EDIT THE SHORTNAME BELOW
        const d = document;
        const s = d.createElement('script');
        
        s.src = 'https://webondevices.disqus.com/embed.js';
        
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
  }

  render() {
    return (
      <div id="disqus_thread" />
    );
  }
}

export default Disqus;
