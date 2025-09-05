import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useFieldContext } from "./form-context";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type TextFieldProps = {
    label: string;
};

export function DateField({ label }: TextFieldProps) {
    const field = useFieldContext<Date | undefined>();

    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="text">
                {label}
            </Label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.state.value && "text-muted-foreground",
                        )}
                        aria-invalid={field.state.meta.errors.length > 0}
                    >
                        {field.state.value ? (
                            format(field.state.value, "PPP")
                        ) : (
                            <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={field.state.value}
                        onSelect={field.handleChange}
                    />
                </PopoverContent>
            </Popover>
            {field.getMeta().isBlurred && (
                <div className="text-xs text-destructive">
                    {field.state.meta.errors.map((error, i) => (
                        <div key={i} className="error">
                            {error?.message}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
