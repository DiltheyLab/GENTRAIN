import type { ReactNode } from "react";
import clsx from "clsx";
import { useState } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const [showVideo, setShowVideo] = useState(false);
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          {!showVideo && (
            <button className="button button--secondary button--lg" onClick={() => setShowVideo(true)} type="button">
              Watch a tutorial video ▶️
            </button>
          )}
          {showVideo && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="bg-white rounded-md p-4 max-w-3xl w-full mx-4">
                <div className={styles.videoWrapper}>
                  <video
                    preload="metadata"
                    src="/video/Gentrain_Videotutorial_compressed.mp4"
                    width="900"
                    height="auto"
                    controls
                    autoPlay
                  ></video>
                  <button
                    className={styles.closeButton}
                    onClick={() => setShowVideo(false)}
                    type="button"
                    aria-label="Close video"
                  >
                    <span aria-hidden>✕</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="In this documentation you will find all information about the app GENTRAIN and how to use it."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
