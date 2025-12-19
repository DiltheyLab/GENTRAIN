import React, { type ReactNode } from "react";
import clsx from "clsx";
import { ThemeClassNames } from "@docusaurus/theme-common";
import type { Props } from "@theme/Footer/Layout";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Translate from "@docusaurus/Translate";

export default function FooterLayout({ style }: Props): ReactNode {
  const {
    siteConfig: { customFields },
  } = useDocusaurusContext();

  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, "footer", {
        "footer--dark": style === "dark",
      })}
    >
      <div className="container container-fluid">
        <div className="footer__bottom text--center">
          <span>
            <Translate id="footer.copyright">© 2025 Universitätsklinikum Düsseldorf</Translate>
          </span>
          {" · "}
          <a href={`https://${customFields?.appUrl}/impress`} target="_blank" rel="noreferrer">
            <Translate id="footer.impressum">Impressum</Translate>
          </a>
          {" · "}
          <a href={`https://${customFields?.appUrl}/data-privacy`} target="_blank" rel="noreferrer">
            <Translate id="footer.dataPrivacy">Datenschutz</Translate>
          </a>
          {" · "}
          <a href={`https://${customFields?.appUrl}/contact`} target="_blank" rel="noreferrer">
            <Translate id="footer.contact">Kontakt</Translate>
          </a>
        </div>
      </div>
    </footer>
  );
}
