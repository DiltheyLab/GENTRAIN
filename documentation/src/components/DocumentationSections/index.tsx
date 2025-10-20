import type { ReactNode } from "react";
import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";
import Translate, { translate } from "@docusaurus/Translate";

type SectionItem = {
  title: string;
  imgSrc: string;
  description: ReactNode;
};

const SectionList: SectionItem[] = [
  {
    title: translate({ id: "home.section.application.title", message: "Anwendung" }),
    imgSrc: "/img/appicon.png",
    description: (
      <Translate id="home.section.application.description">
        Für Endbenutzer: Der Abschnitt Anwendung beschreibt, wie Sie GENTRAIN im Alltag nutzen – vom Import und der
        Verwaltung von Falldaten über die Analyse von Ausbrüchen bis hin zur Visualisierung genetischer Zusammenhänge im
        Dashboard.
      </Translate>
    ),
  },
  {
    title: translate({ id: "home.section.development.title", message: "Entwicklung" }),
    imgSrc: "/img/devicon.png",
    description: (
      <Translate id="home.section.development.description">
        Für Entwickler: Der Entwicklerbereich dokumentiert die Architektur der Anwendung, Datenverwaltung, genomische
        Operationen, Bereitstellungs- und CI-Anleitungen sowie Best Practices für Sicherheit und Tests, die Ihnen bei
        der Erweiterung und Ausführung von GENTRAIN helfen.
      </Translate>
    ),
  },
  {
    title: translate({ id: "home.section.admin.title", message: "Administration" }),
    imgSrc: "/img/adminicon.png",
    description: (
      <Translate id="home.section.admin.description">
        Für Administratoren: Der Admin-Bereich dokumentiert die Benutzer- und Rollenverwaltung, die Konfiguration von
        Pathogenen und Schemata, die Betriebseinstellungen und die Bereitstellungsanleitung für den Betrieb und die
        Wartung von GENTRAIN in der Produktion.
      </Translate>
    ),
  },
];

function Section({ title, imgSrc, description }: SectionItem) {
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

export default function DocumentationSections(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {SectionList.map((props, idx) => (
            <Section key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
