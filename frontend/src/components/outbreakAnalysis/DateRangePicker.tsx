import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "../ui/label";
import { useAnalysisStore } from "@/stores/analysis";
import { Checkbox } from "../ui/checkbox";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const DateRangePicker = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const analysisStore = useAnalysisStore();
    const date = analysisStore.settings.dateRange;

    // Add 7 days to the start and end date as default selected date range
    const [modifiedDateRange, setModifiedDateRange] = useState<DateRange | undefined>({
        from: date.from ? new Date(date.from.getTime() - 7 * 24 * 60 * 60 * 1000) : undefined,
        to: date.to ? new Date(date.to.getTime() + 7 * 24 * 60 * 60 * 1000) : undefined,
    });

    const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
        setModifiedDateRange({ from: start, to: end });
        analysisStore.updateSettings({ dateRange: { from: start, to: end } });
    };

    return (
        <div className={cn("grid gap-2 mt-2", className)}>
            <div className="flex gap-3">
                <Label htmlFor="excludeCasesOutsideOfDateRange">Zeitspanne auswählen</Label>
                <Checkbox
                    id="excludeCasesOutsideOfDateRange"
                    checked={analysisStore.settings.excludeCasesOutsideOfDateRange}
                    onCheckedChange={(value) =>
                        analysisStore.updateSettings({ excludeCasesOutsideOfDateRange: Boolean(value) })
                    }
                />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        disabled={!analysisStore.settings.excludeCasesOutsideOfDateRange}
                        variant="outline"
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !modifiedDateRange && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {modifiedDateRange?.from ? (
                            modifiedDateRange.to ? (
                                <>
                                    {format(modifiedDateRange.from, "LLL dd, y")} -{" "}
                                    {format(modifiedDateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(modifiedDateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Bitte auswählen</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 " align="start">
                    <Calendar
                        initialFocus
                        locale={de}
                        mode="range"
                        defaultMonth={analysisStore.settings.datesOfCasesInSelectedOutbreak[0]}
                        modifiers={{
                            outbreakRange: analysisStore.settings.datesOfCasesInSelectedOutbreak,
                        }}
                        modifiersClassNames={{
                            outbreakRange:
                                "relative after:absolute after:bottom-1.5 after:left-1/2 after:transform after:-translate-x-1/2 after:w-3/5 after:h-0.5 after:bg-red-500 after:content-['']",
                        }}
                        selected={modifiedDateRange}
                        onSelect={(dataRange) => handleDateChange(dataRange?.from, dataRange?.to)}
                        numberOfMonths={2}
                        footer={
                            <div className="flex p-2">
                                <p className="text-xs font-extralight">
                                    An den <span className="underline decoration-red-500">unterstrichenen</span> Tagen
                                    traten Fälle im
                                    <br /> ausgewählten Ausbruch auf.
                                </p>
                            </div>
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
