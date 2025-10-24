import { PromptInput, PromptInputTextarea, PromptInputSubmit } from "@/components/ai-elements/prompt-input";
import { UI_MESSAGES } from "@/lib/consts";

interface GameInputProps{
    input: string
    onInputChange: (e : React.ChangeEvent<HTMLTextAreaElement>) => void
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isLoading: boolean
}

export function GameInput({input, onInputChange, onSubmit, isLoading}: GameInputProps) {
    const inputTrimmed = input.trim();
    const inputSubmitIsDisabled = isLoading || inputTrimmed === '';
    return (
        <PromptInput onSubmit={(_,e) => onSubmit(e)} className="relative pr-8">
            <PromptInputTextarea
                value={input}
                onChange={onInputChange}
                placeholder={UI_MESSAGES.PLACEHOLDERS.INPUT}
            />
            <PromptInputSubmit disabled={inputSubmitIsDisabled} className="absolute bottom-2 right-2"/>
        </PromptInput>
    )
}
