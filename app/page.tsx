'use client'

import {useWalletLogin} from '@lens-protocol/react-web'
import {useAccount, useConnect, useDisconnect} from 'wagmi'
import {InjectedConnector} from 'wagmi/connectors/injected'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSearchParams } from "next/navigation";


export default function Home() {
  const [connectedAccount, setConnectedAccount] = useState<string>();
  const [userLensHandle, setUserLensHandle] = useState<string>();
  const [challengeMessage, setChallengeMessage] = useState<string>();
  const {execute: executeLogin, error: loginError, isPending: isLoginPending} = useWalletLogin()
  const {isConnected} = useAccount();
  const {disconnectAsync} = useDisconnect();
  const {connectAsync} = useConnect({
    connector: new InjectedConnector()
  })
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.has('red') && searchParams.has('challenger') && searchParams.has('score')) {
      setChallengeMessage(`${searchParams.get('challenger')} is challenging you to beat him! Score more than ${searchParams.get('score')} points to win`)
    }
  }, [searchParams])

  async function startLoginProcess() {
    if (isConnected) {
      console.log('Already connected');
      await disconnectAsync();
    }
    const {connector} = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      setConnectedAccount(walletClient.account.address)
      const loginResult = await executeLogin({
        address: walletClient.account.address
      })
      if (loginResult.isFailure()) {
        alert('Login with lens failed')
      }
      const activeUser = loginResult.unwrap()
      if (!activeUser) {
        alert('Login with lens failed')
      }
      if (activeUser) {
        setUserLensHandle(activeUser.handle);
      }
      
    }
  }

  function goToGame() {
    if (searchParams.has('red')) {
      window.location.href = searchParams.get('red') || 'game'
    } else {
      window.location.href = '/game'
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
      </div>
      {
        challengeMessage ? <h1 style={{'marginBottom': '20px'}}>{challengeMessage}</h1> : ''
      }
      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/logo.jpg"
          alt="Lensjump Logo"
          width={180}
          height={37}
          priority
        />

      </div>
      {
        !userLensHandle ? (
          <a className='button' href='#' onClick={startLoginProcess}>Login to Lens</a>
        ) : ''
      }

      {
        connectedAccount ? (
          <a>Connected to: {connectedAccount}</a>
        ): ''
      }

      {
        userLensHandle ? (
          <a className='button' href='#' onClick={goToGame}>Welcome {userLensHandle}, Play the Game</a>
        ): ''
      }
    </main>  
  )
}
