import { useFieldContext } from "./form-context";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type SelectFieldProps = {
    label: string;
    items: Array<string>;
};

export function SelectField({ label, items }: SelectFieldProps) {
    const field = useFieldContext<string>();

    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="text">
                {label}
            </Label>
            <Select
                name={field.name}
                onValueChange={field.handleChange}
                defaultValue={field.state.value}
            >
                <SelectTrigger
                    id={field.name}
                    onBlur={field.handleBlur}
                    aria-invalid={field.state.meta.errors.length > 0}
                    className={cn("opacity-80 w-full")}
                >
                    <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
