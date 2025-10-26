import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'

interface WalletContextType {
  userSession: UserSession | null
  userData: any | null
  isConnected: boolean
  address: string | null
  connect: () => void
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | null>(null)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null)
  const [userData, setUserData] = useState<any | null>(null)

  useEffect(() => {
    const appConfig = new AppConfig(['store_write', 'publish_data'])
    const session = new UserSession({ appConfig })
    setUserSession(session)

    if (session.isUserSignedIn()) {
      setUserData(session.loadUserData())
    }
  }, [])

  const connect = () => {
    if (!userSession) return

    showConnect({
      appDetails: {
        name: 'X-Chain Rewards Bridge',
        icon: window.location.origin + '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        setUserData(userSession.loadUserData())
      },
      userSession,
    })
  }

  const disconnect = () => {
    if (userSession?.isUserSignedIn()) {
      userSession.signUserOut()
      setUserData(null)
    }
  }

  const isConnected = !!userData
  const address = userData?.profile?.stxAddress?.testnet || userData?.profile?.stxAddress?.mainnet || null

  return (
    <WalletContext.Provider
      value={{
        userSession,
        userData,
        isConnected,
        address,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}