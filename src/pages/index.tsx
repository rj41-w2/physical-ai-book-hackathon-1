import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className={styles.gridBackground}></div>
      <div className="container">
        <div className={styles.badge}>HACKATHON 2026</div>
        <Heading as="h1" className={styles.heroTitle}>
          Physical AI <span className={styles.accent}>&</span> Humanoid Robotics
        </Heading>
        <p className={styles.heroSubtitle}>
          Bridging the gap between digital brains and physical bodies. 
          Master the future of embodied intelligence.
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/intro">
            Start Reading
          </Link>
          <Link
            className="button button--outline button--secondary button--lg"
            to="/specs/intro">
            View Technical Specs
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Physical AI & Humanoid Robotics"
      description="A comprehensive course on Physical AI, ROS 2, and Humanoid Robotics simulation.">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
