import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/modules/core/helpers/cn";
import { Button } from "@/modules/core/components/ui/Button";
import { Calendar } from "@/modules/core/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/modules/core/components/ui/Popover";
import { Label } from "@/modules/core/components/ui/Label";
import { useOutbreakAnalysisStore } from "@/modules/outbreak_analysis/stores/outbreakAnalysis";
import { Checkbox } from "@/modules/core/components/ui/Checkbox";

export const DateRangePicker = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const analysisStore = useOutbreakAnalysisStore();
    const date = analysisStore.settings.dateRange;

    const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
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
                        className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
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
                        defaultMonth={date.from}
                        modifiers={{
                            outbreakRange: analysisStore.settings.datesOfCasesInSelectedOutbreak,
                        }}
                        modifiersClassNames={{
                            outbreakRange:
                                "relative after:absolute after:bottom-1.5 after:left-1/2 after:transform after:-translate-x-1/2 after:w-3/5 after:h-0.5 after:bg-red-500 after:content-['']",
                        }}
                        selected={date}
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
