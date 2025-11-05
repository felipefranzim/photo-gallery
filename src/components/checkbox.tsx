import Icon from "./icon";
import CheckIcon from "../assets/icons/check.svg?react";
import { tv, type VariantProps } from "tailwind-variants";

export const checkboxWrapperVariants = tv({
    base: `
        inline-flex items-center justify-center relative group
    `
});

export const checkboxVariants = tv({
    base: `
        appearance-none peer flex items-center justify-center
        cursor-pointer transition overflow-hidden
    `,
    variants: {
        variant: {
            default: `
                border-2 border-solid border-border-primary 
                hover:border-border-active
                checked:border-accent-brand checked:bg-accent-brand
                group-hover:checked:border-accent-brand-light
                group-hover:checked:bg-accent-brand-light
            `
        },
        size: {
            sm: "w-3 h-3 rounded-sm",
            md: "w-5 h-5 rounded-sm",
        },
        disabled: {
            true: "pointer-events-none",
        }
    },
    defaultVariants: {
        variant: "default",
        size: "md",
        disabled: false,
    }
});

export const checkboxIconVariants = tv({
    base: `
        absolute top-1/2 -translate-y-1/2
        hidden peer-checked:block fill-white
        cursor-pointer
    `, // top-1/2 -translate-y-1/2 Centraliza o ícone no meio do checkbox
    variants: {
        size: {
            sm: "w-3 h-3",
            md: "w-5 h-5"
        }
    },
    defaultVariants: {
        size: "md"
    }
});

interface CheckboxProps extends VariantProps<typeof checkboxVariants>, Omit<React.ComponentProps<"input">, "size" | "disabled"> {

}

export default function Checkbox({ variant, size, disabled, className, ...props }: CheckboxProps) {
    return (
        <label className={checkboxWrapperVariants({ className })}>
            <input type="checkbox" className={checkboxVariants({ variant, size, disabled })} {...props} />
            <Icon svg={CheckIcon} className={checkboxIconVariants({ size })} />
        </label>
    )
}