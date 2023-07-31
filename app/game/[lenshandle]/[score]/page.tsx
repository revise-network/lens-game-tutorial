'use client'

declare global {
    interface Window {
        score:any;
    }
}

import { useEffect, useState } from "react";
import {Game} from "../../main";
import { useActiveProfile } from "@lens-protocol/react-web";
import { Post } from "./post";
import { profile } from "console";

export default ({params}: {params: any}) => {
    
    const [gameover, setGameover] = useState<boolean>(false);
    const [gameWon, setGameWon] = useState<boolean>(false);
    const [postStatus, setPostStatus] = useState<boolean>(false);
    const [message, setMessage] = useState<string>();
    const { data: userProfile, error: userProfileError, loading: isUserProfileLoading } = useActiveProfile();
    

    useEffect(() => {
        if (!isUserProfileLoading && !userProfile) {
            window.location.href = `/?red=/game/${params.lenshandle}/${params.score}&challenger=${params.lenshandle}&score=${params.score}`
        }
    }, [isUserProfileLoading])
    useEffect(() => {
        const canvas: any = document.getElementById("game");
        const ctx = canvas.getContext("2d");

        let game = new Game(ctx, canvas)
        game.setGameOverCallback(
            (score) => {
                setGameover(true)
                setGameWon(score.score > parseInt(params.score))
                if (score.score > parseInt(params.score)) alert(`You beat ${params.lenshandle}!`)
            }
        );
        game.setScoreCallback((score) => {
            window.score = score
        });
        game.start();
    }, []);

    const postToFeed = async () => {
        let messageText = ``;
        if (gameWon) {
            messageText = `I just beat ${params.lenshandle} at LensJump!!!!`
        } else {
            messageText = `I lost to ${params.lenshandle} at LensJump :( I'll get you next time 😈`
        }
        setMessage(messageText);
        if(confirm("Post to feed: " + messageText)) {
            setPostStatus(true);
        }
    }

    return (
        <div style={{'display': 'flex', 'flexDirection': 'column'}}>
            <div style={{maxWidth: '1000px'}}>
                {
                    !gameover ? (
                        <canvas style={{'width': '100%'}} id="game"></canvas>
                    ) : ''
                }
            </div>
            <div style={{'marginTop': '30px', 'display': 'flex', flexDirection: 'column'}}>
            {
                gameover ? (
                    <>
                        {
                            gameWon ? <h1>Congrats {userProfile?.handle}! you won</h1> : <h1>Sorry {userProfile?.handle}! you lost :(</h1>
                        }
                        <a href="#" onClick={postToFeed} className="button">Post to your feed!</a>
                        {
                            (postStatus && userProfile) ? <Post message={message || ""} profile={userProfile} /> : ''
                        }
                    </>
                ) : ''
            }
            </div>
        </div>
    )
}