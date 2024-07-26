import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "../ui/label";
import { useAnalysisStore } from "@/stores/analysis";

export const DateRangePicker = ({ className }: React.HTMLAttributes<HTMLDivElement>) => {
    const analysisStore = useAnalysisStore();
    const date = analysisStore.settings.dateRange;

    return (
        <div className={cn("grid gap-2 mt-2", className)}>
            <Label>Zeitspanne auswählen (optional)</Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
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
                        defaultMonth={date?.from}
                        modifiers={{
                            // add every day in the date object to the outbreakRange modifier
                            outbreakRange: analysisStore.settings.datesOfCasesInSelectedOutbreak,
                        }}
                        modifiersClassNames={{
                            outbreakRange:
                                "relative after:absolute after:bottom-1.5 after:left-1/2 after:transform after:-translate-x-1/2 after:w-3/5 after:h-0.5 after:bg-red-500 after:content-['']",
                        }}
                        selected={date}
                        onSelect={(dataRange) => analysisStore.updateSettings({ dateRange: dataRange })}
                        numberOfMonths={2}
                        footer={
                            <div className="flex justify-center p-2">
                                <p className="text-xs font-extralight">
                                    <span className="underline decoration-red-500">Markierungen</span> zeigen, an
                                    welchen Tagen Fälle <br /> im ausgewählten Ausbruch aufgetreten sind.
                                </p>
                            </div>
                        }
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
