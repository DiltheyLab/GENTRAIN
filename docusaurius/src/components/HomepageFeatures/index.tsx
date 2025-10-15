import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  imgSrc: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: "Application",
    imgSrc: "/img/appicon.png",
    description: (
      <>
        Learn how to use GENTRAIN as an end user: <br /> Importing and managing sequence data, working with samples and
        pathogens, running outbreak analyses and visualizing results in the dashboard, and exporting data while
        respecting privacy and retention (TTL) settings.
      </>
    ),
  },
  {
    title: "Developers",
    imgSrc: "/img/devicon.png",
    description: (
      <>
        For contributors and integrators: <br /> The developers section documents the application's architecture,
        data-management patterns, genomic operations, deployment and CI guidance, plus security & testing best practices
        to help you extend and run GENTRAIN.
      </>
    ),
  },
  {
    title: "Admin",
    imgSrc: "/img/adminicon.png",
    description: (
      <>
        For system operators:
        <br /> The admin section documents user and role management, pathogen and schema configuration, operational
        settings and deployment guidance to run and maintain GENTRAIN in production.
      </>
    ),
  },
];

function Feature({ title, imgSrc, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <img src={imgSrc} alt={`${title} icon`} width={200} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
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
