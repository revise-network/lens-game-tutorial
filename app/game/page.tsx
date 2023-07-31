'use client'

declare global {
    interface Window {
        score:any;
    }
}

import { useEffect, useState } from "react";
import { useActiveProfile } from "@lens-protocol/react-web";

import {Game} from "./main";
import Followers from "./followers";

export default () => {
    const [gameover, setGameover] = useState<boolean>(false);
    const [shouldLoadFriends, setShouldLoadFriends] = useState<boolean>(false);

    const {data: activeProfile, error: profileError, loading: isActiveProfileLoading} = useActiveProfile();

    useEffect(() => {
        if (! isActiveProfileLoading && ! activeProfile) {
            alert('Please log in to play..')
        }
    }, [activeProfile])

    const [scoreObj, setScore] = useState<any>();

    // const metamaskConfig = metamaskWallet();
    // const connect = useConnect();
    
    
    async function run() {
        // const wallet = await connect(metamaskConfig);
        // console.log("wallet", wallet); 
        // setGameover(true)
    }

    useEffect(() => {
        if (! isActiveProfileLoading && ! activeProfile) {
            alert('You are not logged in')
        }
    }, [isActiveProfileLoading])

    useEffect(() => {
        run()
        const canvas: HTMLCanvasElement | null = document.getElementById("game") as HTMLCanvasElement;
        if (! canvas) throw new Error("Canvas not found")
        const ctx = canvas.getContext("2d");

        let game = new Game(ctx, canvas)
        game.setGameOverCallback(
            (score) => {
                setGameover(true)
            }
        );
        game.setScoreCallback((score) => {
            setScore(score);
            window.score = score
        });
        game.start();
    }, []);

    function loadFriends() {
        setShouldLoadFriends(true)
    }

    return (
        <div style={{'display': 'flex', 'flexDirection': 'column', alignItems: 'center'}}>
            <div style={{maxWidth: '1000px'}}>
                <canvas style={{'width': '100%'}} id="game"></canvas>
            </div>
            <div style={{'marginTop': '30px'}}>
            {
                gameover ? (
                    <>
                        <a href="#" className="button" onClick={loadFriends}>Challenge Friends?</a>
                        <a href="/game" className="button">Try again</a>
                    </>
                ) : ''
            }
            {(shouldLoadFriends && ! isActiveProfileLoading) ? (
                <Followers profileId={activeProfile?.id} lensHandle={activeProfile?.handle} score={scoreObj}></Followers>
            ): ''}
            </div>
        </div>
    )
}