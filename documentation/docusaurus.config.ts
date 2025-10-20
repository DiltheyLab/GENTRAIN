import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: "GENTRAIN - Documentation",
  tagline: "",
  favicon: "img/favicon.ico",

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: "https://gentrain.bi.denbi.de",
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: "/",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "facebook", // Usually your GitHub org/user name.
  projectName: "docusaurus", // Usually your repo name.

  onBrokenLinks: "throw",

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "de",
    locales: ["en", "de"],
    localeConfigs: {
      de: {
        htmlLang: "de",
      },
      en: {
        htmlLang: "en-GB",
      },
    },
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          //editUrl: "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
          // Useful options to enforce blogging best practices
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
          blogSidebarTitle: "Kürzliche Beiträge",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    //image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      //title: "GENTRAIN",
      logo: {
        alt: "GENTRAIN Logo",
        src: "img/logo.svg",
        width: 200,
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "applicationSidebar",
          position: "left",
          label: "Anwendung",
        },
        {
          type: "docSidebar",
          sidebarId: "developmentSidebar",
          label: "Entwicklung",
        },
        {
          type: "docSidebar",
          sidebarId: "adminSidebar",
          position: "left",
          label: "Administration",
        },
        { to: "/blog", label: "Blog", position: "right" },
        {
          href: "https://github.com/DiltheyLab/GENTRAIN",
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      // justify: "space-between",
      copyright: `<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;"><div>Copyright © ${new Date().getFullYear()} Universitätsklinikum Düsseldorf</div> <div><a href="https://gentrain.bi.denbi.de/impress" target="_blank">Impressum</a> · <a href="https://gentrain.bi.denbi.de/data-privacy" target="_blank">Datenschutz</a> · <a href="https://gentrain.bi.denbi.de/contact" target="_blank">Kontakt</a></div></div>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,

  // Mermoid support
  markdown: {
    mermaid: true,
  },
  themes: ["@docusaurus/theme-mermaid"],
};

export default config;
