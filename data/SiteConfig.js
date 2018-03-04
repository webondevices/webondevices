module.exports = {
  blogPostDir: "posts", // The name of directory that contains your posts.
  siteTitle: "Web on Devices", // Site title.
  siteTitleAlt: "Electronics Hacking with JavaScript and other Web Technologies", // Alternative site title for SEO.
  siteLogo: "/static/favicon.png", // Logo used for SEO and manifest.
  siteUrl: "http://www.webondevices.com", // Domain of your website without pathPrefix.
  pathPrefix: "/", // Prefixes all links. For cases when deployed to example.github.io/gatsby-advanced-starter/.
  siteDescription: "Electronics Hacking with JavaScript and other Web Technologies", // Website description used for RSS feeds/meta description tag.
  siteRss: "/rss.xml", // Path to the RSS file.
  siteFBAppID: "", // FB Application ID for using app insights
  googleAnalyticsID: "UA-64514566-1", // GA tracking ID.
  disqusShortname: "webondevices", // Disqus shortname.
  postDefaultCategoryID: "Tech", // Default category for posts.
  userName: "Mate Marschalko", // Username to display in the author segment.
  userTwitter: "", // Optionally renders "Follow Me" in the UserInfo segment.
  userLocation: "London, UK", // User location to display in the author segment.
  userAvatar: "", // User avatar to display in the author segment.
  userDescription: "", // User description to display in the author segment.
  
  // Links to social profiles/projects you want to display in the author segment/navigation bar.
  userLinks: [
    {
      label: "GitHub",
      url: "https://github.com/webondevices",
      iconClassName: "fa fa-github"
    },
    {
      label: "Twitter",
      url: "https://twitter.com/web_on_devices",
      iconClassName: "fa fa-twitter"
    },
    {
      label: "Email",
      url: "mailto:webondevices@gmail.com",
      iconClassName: "fa fa-envelope"
    }
  ],
  copyright: "Copyright ©2018. Web on Devices", // Copyright string for the footer of the website and RSS feed.
  themeColor: "#c62828", // Used for setting manifest and progress theme colors.
  backgroundColor: "#e0e0e0" // Used for setting manifest background color.
};
