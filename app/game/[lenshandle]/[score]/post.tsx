import { ContentFocus, ProfileOwnedByMe, useCreatePost } from "@lens-protocol/react-web";
import axios from "axios";
import { useEffect, useState } from "react";

type JsonBinResult = {
    record: any,
    metadata: {
        id: string,
        createdAt: string,
        private: boolean
    }
}

export const Post = ({message, profile}: {message: string, profile: ProfileOwnedByMe}) => {
    const [postingStarted, setPostingStarted] = useState<boolean>(false);
    const upload = async (data: unknown): Promise<string> => {
        const serialized = JSON.stringify(data);
        const res = await axios.post(`https://api.jsonbin.io/v3/b`, serialized, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$bW4rAH5942BrbQdZR.CHP.NpxlfQVKnWVHGrfg2TAWKq5nBShLLGW',
                'X-Bin-Private': 'false',
            }
        });
        let url = serialized;
        return `https://api.jsonbin.io/v3/b/${(res.data as JsonBinResult).metadata.id}?meta=false`;
    }
    const { execute, error, isPending } = useCreatePost({ publisher: profile, upload });
    useEffect(() => {
        run()    
    }, []);

    async function run() {
        await execute({
            content: message,
            contentFocus: ContentFocus.TEXT_ONLY,
            locale: 'en'
        })
        setPostingStarted(true)
    }

    return (
        <>
            {
                (!isPending && postingStarted) ? 'Posted to your Feed!' : <h1>Posting...</h1>
            }
        </>
    )
}