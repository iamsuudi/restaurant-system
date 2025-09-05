import React from "react";
import { useFieldContext } from "./form-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TextFieldProps = {
    label: string;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
};

export function FileField({ label, setFile }: TextFieldProps) {
    const field = useFieldContext<File>();

    return (
        <div className="space-y-2">
            <Label htmlFor={field.name} className="text">
                {label}
            </Label>
            <Input
                type="file"
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                }}
                className={cn(
                    { "border-green-500": field.state.meta.isValid },
                    {
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive":
                            field.getMeta().isBlurred,
                    },
                    "opacity-80",
                )}
                aria-invalid={field.state.meta.errors.length > 0}
            />
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
