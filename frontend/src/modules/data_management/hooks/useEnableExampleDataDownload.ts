import {useEffect, useState} from "react";

export const useEnableExampleDataDownload = (exampleDataPath: string | null) => {
    const [enableExampleDataDownload, setEnableExampleDataDownload] = useState(false);

    useEffect(() => {
        if (!exampleDataPath) {
            return;
        }
        fetch(exampleDataPath).then((response) => {
            if (response.ok) {
                setEnableExampleDataDownload(true);
            } else {
                setEnableExampleDataDownload(false);
            }
        }).catch(() => {
            setEnableExampleDataDownload(false);
        })
    }, [exampleDataPath]);

    return enableExampleDataDownload;
};
