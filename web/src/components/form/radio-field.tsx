import _ from "lodash";
import { useFieldContext } from "./form-context";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface RadioFieldParams {
    label: string;
    options: Array<string>;
}

export const RadioField = ({ label, options }: RadioFieldParams) => {
    const field = useFieldContext<string>();

    return (
        <div className="space-y-3">
            <Label htmlFor={field.name}>{label}</Label>
            <RadioGroup
                name={field.name}
                value={field.state.value || ""}
                onBlur={field.handleBlur}
                onValueChange={field.handleChange}
                className="flex gap-4 px-2"
            >
                {options.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                            value={option}
                            id={option}
                            aria-invalid={field.state.meta.errors.length > 0}
                            className={cn({
                                "bg-primary": field.state.value === option,
                            })}
                        />
                        <Label htmlFor={option}>{_.capitalize(option)}</Label>
                    </div>
                ))}
            </RadioGroup>
            <div className="text-xs text-destructive">
                {field.state.meta.errors.map((error, i) => (
                    <div key={i} className="error">
                        {error?.message}
                    </div>
                ))}
            </div>
        </div>
    );
};
