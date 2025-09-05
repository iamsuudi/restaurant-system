import { useFieldContext } from "./form-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

type NumberFieldProps = {
    label: string;
    placeholder?: string;
    readOnly?: boolean;
    step?: string | number;
};

export function NumberField({
    label,
    placeholder,
    readOnly,
    step,
}: NumberFieldProps) {
    const field = useFieldContext<number>();

    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="text">
                {label}
            </Label>
            <Input
                type="number"
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                placeholder={placeholder}
                step={step}
                readOnly={readOnly}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                aria-invalid={field.state.meta.errors.length > 0}
            />
            {
                <div className="text-xs text-destructive">
                    {field.getMeta().isBlurred &&
                        field.state.meta.errors.map((error, i) => (
                            <div key={i} className="error">
                                {error?.message}
                            </div>
                        ))}
                </div>
            }
        </div>
    );
}
