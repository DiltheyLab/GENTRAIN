import { t } from "i18next";
import { Trans } from "react-i18next";

export const renderHtmlFromTranslation = (i18nKey: string) => {
    const elements: { tag: "p" | "code"; content: string }[] | { tag: "ul"; content: string[] }[] = t(i18nKey, {
        returnObjects: true,
    });
    return elements.map((element) => {
        switch (element.tag) {
            case "p":
                return (
                    <p>
                        <Trans shouldUnescape>{element.content}</Trans>
                    </p>
                );
            case "ul":
                return (
                    <ul className="list-disc pl-4">
                        {element.content.map((child) => (
                            <li>
                                <Trans shouldEscape>{child}</Trans>
                            </li>
                        ))}
                    </ul>
                );
            case "code":
                return (
                    <code className="p-8 bg-muted rounded-lg">
                        <Trans shouldUnescape>{element.content}</Trans>
                    </code>
                );
            default:
                return null;
        }
    });
};
