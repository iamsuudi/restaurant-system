import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { TextField } from "./text-field";
import { RadioField } from "./radio-field";
import { SubscribeButton } from "./subcription-button";
import { SelectField } from "./selector-field";
import { FileField } from "./file-field";
import { DateField } from "./date-field";
import { NumberField } from "./number-field";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
    createFormHookContexts();

export const { useAppForm } = createFormHook({
    fieldContext,
    formContext,
    fieldComponents: {
        TextField,
        RadioField,
        SelectField,
        FileField,
        DateField,
        NumberField,
    },
    formComponents: {
        SubscribeButton,
    },
});
