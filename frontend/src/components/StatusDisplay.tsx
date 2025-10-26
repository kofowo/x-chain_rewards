import React, { useState, useEffect } from 'react'
import { useWallet } from './WalletConnect'
import { getAdmin, network } from '../utils/stacks'

export const StatusDisplay: React.FC = () => {
  const { isConnected, address } = useWallet()
  const [contractAdmin, setContractAdmin] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true)
      try {
        const admin = await getAdmin()
        setContractAdmin(admin)
      } catch (error) {
        console.error('Error fetching admin:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmin()
  }, [])

  return (
    <div style={{marginTop: 24}}>
      {/* Bridge Flow */}
      <div style={{padding: 16, border: '1px dashed #e5e7eb', borderRadius: 12, marginBottom: 16}}>
        <h3>🌉 Bridge Flow</h3>
        <ol style={{paddingLeft: 20}}>
          <li><strong>Lock STX</strong> on Stacks blockchain</li>
          <li><strong>🔎 Oracle monitors</strong> lock events</li>
          <li><strong>🪙 Mint wrapped STX</strong> on destination chain (Polygon)</li>
          <li><strong>✅ Oracle confirms</strong> mint transaction</li>
          <li><strong>⏳ Timeout protection:</strong> Users can refund if oracle fails</li>
        </ol>
      </div>

      {/* Network Status */}
      <div style={{padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, marginBottom: 16}}>
        <h3>📡 Network Status</h3>
        <div style={{display: 'grid', gap: 8, fontSize: '0.9em'}}>
          <div>
            <strong>Stacks Network:</strong> {network.isMainnet() ? 'Mainnet' : 'Testnet'}
          </div>
          <div>
            <strong>Contract Admin:</strong> {loading ? 'Loading...' : contractAdmin || 'Unknown'}
          </div>
          <div>
            <strong>Your Address:</strong> {isConnected ? address : 'Not connected'}
          </div>
          <div>
            <strong>RPC Endpoint:</strong> {network.coreApiUrl}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{padding: 16, border: '1px solid #e5e7eb', borderRadius: 12}}>
        <h3>✨ Features</h3>
        <div style={{display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
          <div>
            <h4>🔒 Secure Locking</h4>
            <p style={{fontSize: '0.9em', color: '#666', margin: 0}}>
              STX tokens are securely locked in the smart contract until oracle confirmation or timeout.
            </p>
          </div>
          <div>
            <h4>⚡ Fast Oracle</h4>
            <p style={{fontSize: '0.9em', color: '#666', margin: 0}}>
              Automated oracle monitors both chains and facilitates cross-chain communication.
            </p>
          </div>
          <div>
            <h4>🛡️ Refund Protection</h4>
            <p style={{fontSize: '0.9em', color: '#666', margin: 0}}>
              Users can refund locked STX if oracle fails to confirm within the timeout period.
            </p>
          </div>
          <div>
            <h4>🔄 Multi-Chain</h4>
            <p style={{fontSize: '0.9em', color: '#666', margin: 0}}>
              Supports bridging to multiple EVM-compatible chains including Polygon.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 16, 
        padding: 12, 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        borderRadius: 8,
        fontSize: '0.85em'
      }}>
        <strong>⚠️ Demo Notice:</strong> This is a proof-of-concept for educational purposes. 
        Not recommended for production use without proper security audits and enhancements.
      </div>
    </div>
  )
}