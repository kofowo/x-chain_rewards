import React from 'react'
import { WalletProvider } from './components/WalletConnect'
import { BridgeForm } from './components/BridgeForm'
import { StatusDisplay } from './components/StatusDisplay'

export default function App() {
  return (
    <WalletProvider>
      <div style={{maxWidth: 880, margin: '40px auto', fontFamily: 'Inter, system-ui', padding: '0 20px'}}>
        <header style={{textAlign: 'center', marginBottom: 40}}>
          <h1 style={{fontSize: '2.5em', margin: '20px 0 10px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            🌉 X-Chain Rewards
          </h1>
          <p style={{fontSize: '1.1em', color: '#666', maxWidth: 600, margin: '0 auto'}}>
            Bridge STX tokens from Stacks to EVM chains like Polygon. 
            Lock STX, get wrapped tokens, powered by a decentralized oracle.
          </p>
        </header>
        
        <BridgeForm />
        <StatusDisplay />
        
        <footer style={{
          marginTop: 60, 
          padding: 20, 
          textAlign: 'center', 
          opacity: 0.7,
          fontSize: '0.9em',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p>🚧 Demo only — not for production use.</p>
          <p>Built for DoraHacks hackathon • <a href="https://github.com/kofowo/x-chain_rewards" target="_blank">Source Code</a></p>
        </footer>
      </div>
    </WalletProvider>
  )
}