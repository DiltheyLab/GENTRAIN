import { t } from "i18next";
import { Trans } from "react-i18next";

type TranslationElement =
    | { tag: "p"; content: string }
    | { tag: "ul"; content: string[] }
    | { tag: "code"; content: string };

export const renderHtmlFromTranslation = (i18nKey: string) => {
    const elements = t(i18nKey, {
        returnObjects: true,
    }) as TranslationElement[];
    return elements.map((element, elementIndex) => {
        switch (element.tag) {
            case "p":
                return (
                    <p key={`${element.tag}_${elementIndex}`}>
                        <Trans shouldUnescape>{element.content}</Trans>
                    </p>
                );
            case "ul":
                return (
                    <ul className="list-disc pl-4" key={`${element.tag}_${elementIndex}`}>
                        {element.content.map((child, listIndex) => (
                            <li key={`${element.tag}_${elementIndex}_li_${listIndex}`}>
                                <Trans shouldEscape>{child}</Trans>
                            </li>
                        ))}
                    </ul>
                );
            case "code":
                return (
                    <code className="p-8 bg-muted rounded-lg" key={`${element.tag}_${elementIndex}`}>
                        <Trans shouldUnescape>{element.content}</Trans>
                    </code>
                );
            default:
                return null;
        }
    });
};
