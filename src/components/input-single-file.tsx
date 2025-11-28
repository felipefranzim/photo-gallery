import { tv, type VariantProps } from "tailwind-variants"
import Icon from "./icon";
import UploadFileIcon from "../assets/icons/upload-file.svg?react";
import FileImageIcon from "../assets/icons/image.svg?react";
import Text, { textVariants } from "./text";
import { useWatch } from "react-hook-form";
import { useMemo } from "react";
import ImageFilePreview from "./image-file-preview";

export const inputSingleFileVariants = tv({
    base: `
        flex flex-col items-center justify-center
        w-full border border-solid border-border-primary 
        group-hover:border-border-active
        rounded-lg
        px-6 py-6 gap-1 transition
    `
});

interface InputSingleFileProps extends VariantProps<typeof inputSingleFileVariants>,
    React.ComponentProps<"input"> {
    form: any;
    allowedExtensions: string[];
    maxSizeInMB: number;
    error?: React.ReactNode;
}


export default function InputSingleFile({ form, allowedExtensions, maxSizeInMB, error, ...props }: InputSingleFileProps) {
    const formValues = useWatch({ control: form.control });
    const name = props.name || "";
    const formFile: File = useMemo(() => formValues[name]?.[0], [formValues, name]);

    const { fileExtension, fileSize, file } = useMemo(() => ({
        fileExtension: formFile?.name?.split('.')?.pop()?.toLowerCase() || "",
        fileSize: formFile?.size,
        file: formFile ? URL.createObjectURL(formFile) : undefined
    }), [formFile]);

    const isValidExtension = () => {
        return allowedExtensions.includes(fileExtension);
    }

    const isValidSize = () => {
        return fileSize <= maxSizeInMB * 1024 * 1024;
    }

    const isValidFile = () => {
        return isValidExtension() && isValidSize();
    }

    return (
        <div>
            {
                !formFile || !isValidFile() ? (
                    <>
                        <div className="w-full relative group cursor-pointer">
                            <input type="file" className="absolute top-0 right-0 w-full h-full opacity-0 cursor-pointer" {...props} />
                            <div className={inputSingleFileVariants()}>
                                <Icon svg={UploadFileIcon} className="w-8 h-8 fill-placeholder" />
                                <Text variant="label-medium" className="text-placeholder text-center">
                                    Arraste o arquivo arquivo
                                    <br />
                                    ou clique para selecionar
                                </Text>
                            </div>
                        </div>
                        {
                            formFile && !isValidExtension() && (
                                <Text variant="label-small" className="text-accent-red">
                                    Extensão inválida. Extensões permitidas: {allowedExtensions.join(", ")}
                                </Text>
                            )
                        }
                        {
                            formFile && !isValidSize() && (
                                <Text variant="label-small" className="text-accent-red">
                                    Tamanho máximo do arquivo excedido. Tamanho máximo: {maxSizeInMB}MB
                                </Text>
                            )
                        }
                        {
                            error && (
                                <Text variant="label-small" className="text-accent-red">
                                    {error}
                                </Text>
                            )
                        }
                    </>
                ) : (
                    <>
                        {
                            file && (
                                <ImageFilePreview src={file} />
                            )
                        }
                        <div className="flex gap-3 items-center border border-solid border-border-primary mt-5 p-3 rounded">
                            <Icon svg={FileImageIcon} className="fill-white w-6 h-6" />
                            <div className="flex flex-col">
                                <div className="truncate max-w-80">
                                    <Text variant="label-medium" className="text-placeholder">
                                        {formFile.name}
                                    </Text>
                                </div>
                                <div className="flex">
                                    <button type="button" className={textVariants({
                                        variant: "label-small",
                                        className: "text-accent-red cursor-pointer hover:underline"
                                    })}
                                        onClick={() => {
                                            form.setValue(name, undefined);
                                        }}>
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    )
}