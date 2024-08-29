import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Layout } from "@/modules/core/components/layout/Layout";

export function Error() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <Layout>
                <div>
                    <h1>Oops!</h1>
                    <h2>{error.status}</h2>
                    <p>{error.statusText}</p>
                    {error.data?.message && <p>{error.data.message}</p>}
                </div>
            </Layout>
        );
    } else {
        return <div>Oops</div>;
    }
}
