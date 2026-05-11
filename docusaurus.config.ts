import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'AI & Robotics Book',
  tagline: 'Mastering Embodied Intelligence & Humanoid Robotics',
  favicon: 'img/ai-robotics.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://physical-ai-book.example.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'panaversity',
  projectName: 'physical-ai-book',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/panaversity/physical-ai-book/tree/main/',
        },
        blog: false, // Disabling blog as requested
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'specs',
        path: '.specify/specs',
        routeBasePath: 'specs',
        sidebarPath: './sidebarsSpecs.ts',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/ai-robotics.png',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'AI & Robotics Book',
      logo: {
        alt: 'AI & Robotics Logo',
        src: 'img/ai-robotics.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Read Book',
        },
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Specs',
          docsPluginId: 'specs',
        },
        {
          href: 'https://github.com/panaversity/spec-kit-plus',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Course Content',
          items: [
            {
              label: 'Read Book',
              to: '/docs/intro',
            },
            {
              label: 'Technical Specs',
              to: '/specs/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Panaversity',
              href: 'https://panaversity.org',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/panaversity',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Spec-Kit Plus',
              href: 'https://github.com/panaversity/spec-kit-plus',
            },
            {
              label: 'Hackathon Details',
              href: 'https://github.com/panaversity/physical-ai-book-hackathon-1',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} AI & Robotics Book. Built for the Physical AI Hackathon with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
