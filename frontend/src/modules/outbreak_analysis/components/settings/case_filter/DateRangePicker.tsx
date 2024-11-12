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
import { CustomTooltip } from "@/modules/core/components/ui/CustomTooltip";

type DateRangePickerProps = {
    disabled?: boolean;
};

export const DateRangePicker = ({ disabled = false }: DateRangePickerProps) => {
    const outbreakAnalysisStore = useOutbreakAnalysisStore();
    const date = outbreakAnalysisStore.analysisSettings.dateRange;

    const handleDateChange = (start: Date | undefined, end: Date | undefined) => {
        outbreakAnalysisStore.updateAnalysisSettings({ dateRange: { from: start, to: end } });
    };

    return (
        <div className="grid gap-2 mt-2">
            <div className="flex gap-3 items-center">
                <Checkbox
                    id="excludeCasesOutsideOfDateRange"
                    checked={outbreakAnalysisStore.analysisSettings.excludeCasesOutsideOfDateRange}
                    onCheckedChange={(value) =>
                        outbreakAnalysisStore.updateAnalysisSettings({ excludeCasesOutsideOfDateRange: Boolean(value) })
                    }
                    disabled={disabled}
                />
                <Label htmlFor="excludeCasesOutsideOfDateRange" className="font-normal mt-[2px] ">
                    Zeitspanne auswählen
                </Label>
                <CustomTooltip
                    content={
                        <p>
                            <strong className="font-bold">Umgebungsfälle</strong> außerhalb des ausgewählten Zeitraums
                            werden ausgeschlossen. Fälle im ausgewählten Ausbruch werden nicht von diesem Filter
                            beeinflusst.
                        </p>
                    }
                    disabled={false}
                />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        disabled={!outbreakAnalysisStore.analysisSettings.excludeCasesOutsideOfDateRange || disabled}
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
                            outbreakRange: outbreakAnalysisStore.analysisSettings.datesOfCasesInSelectedOutbreak,
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
