import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  moduleNum: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'The Robotic Nervous System',
    moduleNum: '01',
    description: (
      <>
        Master ROS 2 middleware, communication patterns, and URDF robot descriptions 
        to build the foundational connectivity of humanoid robots.
      </>
    ),
  },
  {
    title: 'The Digital Twin',
    moduleNum: '02',
    description: (
      <>
        Simulate complex physics, gravity, and sensors in Gazebo and Unity. 
        Create high-fidelity environments for risk-free robot training.
      </>
    ),
  },
  {
    title: 'The AI-Robot Brain',
    moduleNum: '03',
    description: (
      <>
        Leverage NVIDIA Isaac Sim and SDKs for photorealistic perception, 
        VSLAM, and hardware-accelerated navigation.
      </>
    ),
  },
  {
    title: 'Vision-Language-Action',
    moduleNum: '04',
    description: (
      <>
        Integrate LLMs with physical actuators. Use OpenAI Whisper and GPT 
        to translate natural language into complex ROS 2 actions.
      </>
    ),
  },
];

function Feature({title, moduleNum, description}: FeatureItem) {
  return (
    <div className={clsx('col col--3', styles.featureCol)}>
      <div className={styles.featureCard}>
        <div className={styles.moduleBadge}>MODULE {moduleNum}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDescription}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
