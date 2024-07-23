import { useGetCaseBySampleId } from "@/hooks/database/cases/useGetCaseBySampleId";

export function SampleInfoCard({ fastaId }: { fastaId: string }) {
    const caseData = useGetCaseBySampleId(fastaId);

    return (
        <div>
            <div className="mb-2">
                <h4 className="mb-1 font-medium leading-none text-sm">Fall</h4>
                <p className="text-sm text-muted-foreground">{caseData?.case_id}</p>
            </div>
            <div>
                <h4 className="mb-1 font-medium leading-none text-sm">Registrierungsdatum</h4>
                <p className="text-sm text-muted-foreground">
                    {caseData ? caseData.registered_at.toLocaleDateString() : ""}
                </p>
            </div>
        </div>
    );
}
