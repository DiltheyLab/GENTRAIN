import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { Layout } from "@/modules/core/components/layout/Layout";

export function Error() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <Layout>
                <div className="w-full p-10 md:p-20 lg:p-40 flex flex-col">
                    <h1 className="text-[5rem] font-bold text-primary mb-8">Oops!</h1>

                    {error.status === 404 ? (
                        <p className="text-xl">
                            Die von Ihnen angefragte Seite existiert nicht. <a href="/">Hier</a> gelangen Sie zum
                            Dashboard.
                        </p>
                    ) : (
                        <p className="text-xl">Es ist ein interner Fehler aufgetreten.</p>
                    )}
                </div>
            </Layout>
        );
    } else {
        return <div>Oops</div>;
    }
}
