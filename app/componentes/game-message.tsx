import { Message, MessageContent } from "@/components/ai-elements/message";
import { type GameMassage as GameMessageType } from "@/lib/types";
import { Image } from "@/components/ai-elements/image";
import { UI_MESSAGES } from "@/lib/consts";
import { Loader } from "@/components/ai-elements/loader";
import { Response } from "@/components/ai-elements/response";

export function GameMessage({ message }: { message: GameMessageType }) {
    const {role, content, image, imageLoading} = message;
    return (
        <Message from={role}>
            <MessageContent>
                {
                    imageLoading && (
                        <div className="flex mb-4 space-x-2">
                            <Loader />
                            <span>{UI_MESSAGES.LOADING.IMAGE}</span>
                        </div>
                    )
                }
                {
                    image && (
                        <picture className="w-full max-w-2xl aspect-video overflow-hidden rounded-md">
                            <Image
                                base64={image.base64Data}
                                mediaType={image.mediaType}
                                uint8Array={new Uint8Array()}
                                alt="Zombie apocalypse pixel art image"
                                className="w-full h-auto"
                            />
                        </picture>
                    )
                }
                <Response>
                    {content}
                </Response>
            </MessageContent>
            
        </Message>
    )
}