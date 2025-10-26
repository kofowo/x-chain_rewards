import React, { useState } from 'react'
import { useWallet } from './WalletConnect'
import { contractCallLock, getTransactionStatus } from '../utils/stacks'
import { mockOracleConfirm } from '../utils/oracle'
import { getChainInfo } from '../utils/polygon'

export const BridgeForm: React.FC = () => {
  const { isConnected, address, connect } = useWallet()
  const [amount, setAmount] = useState('1000000') // 1 STX in microSTX
  const [recipient, setRecipient] = useState('0x742d35Cc6635C0532925a3b8D200dC35e843C665')
  const [target, setTarget] = useState('137')
  const [lastTxId, setLastTxId] = useState<string | null>(null)
  const [lastLockId, setLastLockId] = useState<number>(1) // For demo purposes
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onLock = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    setBusy(true)
    setError(null)
    setSuccess(null)
    
    try {
      const txId = await contractCallLock(
        Number(amount), 
        recipient, 
        Number(target),
        address
      )
      
      setLastTxId(txId)
      setSuccess(`STX lock transaction submitted! TX ID: ${txId}`)
      
      // For demo purposes, increment the lock ID
      setLastLockId(prev => prev + 1)
    } catch (e: any) {
      setError(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const onOracle = async () => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    setBusy(true)
    setError(null)
    setSuccess(null)
    
    try {
      // Simulate oracle confirmation
      const confirmTxId = await mockOracleConfirm(lastLockId, 'mock-polygon-tx', address)
      setSuccess(`Oracle confirmation submitted! TX ID: ${confirmTxId}`)
    } catch (e: any) {
      setError(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const onCheckStatus = async () => {
    if (!lastTxId) return
    
    setBusy(true)
    setError(null)
    
    try {
      const status = await getTransactionStatus(lastTxId)
      alert(`Transaction status: ${status.tx_status}\nBlock: ${status.block_height || 'Pending'}`)
    } catch (e: any) {
      setError(e.message || String(e))
    } finally {
      setBusy(false)
    }
  }

  const chainInfo = getChainInfo(Number(target))

  if (!isConnected) {
    return (
      <div style={{padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, marginTop: 20, textAlign: 'center'}}>
        <h2>Connect Wallet</h2>
        <p>Connect your Stacks wallet to start bridging STX</p>
        <button onClick={connect} className="connect-btn">
          Connect Stacks Wallet
        </button>
      </div>
    )
  }

  return (
    <div style={{padding: 16, border: '1px solid #e5e7eb', borderRadius: 12, marginTop: 20}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
        <h2>Lock STX</h2>
        <div style={{fontSize: '0.9em', color: '#666'}}>
          Connected: {address?.slice(0, 8)}...{address?.slice(-4)}
        </div>
      </div>
      
      <div style={{display:'grid', gap: 12, gridTemplateColumns: '1fr 1fr'}}>
        <label>Amount (microSTX)
          <input 
            value={amount} 
            onChange={e=>setAmount(e.target.value)} 
            style={{width:'100%', padding: 8, marginTop: 4}} 
            placeholder="1000000"
          />
          <small style={{color: '#666'}}>1 STX = 1,000,000 microSTX</small>
        </label>
        <label>Target Chain
          <select 
            value={target} 
            onChange={e=>setTarget(e.target.value)} 
            style={{width:'100%', padding: 8, marginTop: 4}}
          >
            <option value="137">Polygon Mainnet</option>
            <option value="80001">Polygon Mumbai (Testnet)</option>
          </select>
          {chainInfo && <small style={{color: '#666'}}>{chainInfo.name}</small>}
        </label>
      </div>
      
      <label style={{display:'block', marginTop: 12}}>Destination Address (EVM)
        <input 
          value={recipient} 
          onChange={e=>setRecipient(e.target.value)} 
          style={{width:'100%', padding: 8, marginTop: 4}} 
          placeholder="0x742d35Cc6635C0532925a3b8D200dC35e843C665"
        />
        <small style={{color: '#666'}}>Your Polygon wallet address</small>
      </label>
      
      <div style={{display:'flex', gap: 12, marginTop: 16, flexWrap: 'wrap'}}>
        <button 
          onClick={onLock} 
          disabled={busy}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: busy ? 'not-allowed' : 'pointer'
          }}
        >
          {busy ? 'Processing...' : 'Lock STX'}
        </button>
        
        <button 
          onClick={onOracle} 
          disabled={busy || !lastTxId}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: (busy || !lastTxId) ? 'not-allowed' : 'pointer'
          }}
        >
          {busy ? 'Processing...' : 'Simulate Oracle'}
        </button>
        
        {lastTxId && (
          <button 
            onClick={onCheckStatus} 
            disabled={busy}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: busy ? 'not-allowed' : 'pointer'
            }}
          >
            Check Status
          </button>
        )}
      </div>
      
      {lastTxId && (
        <div style={{marginTop: 12, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 6}}>
          <p><strong>Last Transaction:</strong> <code>{lastTxId}</code></p>
          <p><strong>Lock ID:</strong> #{lastLockId}</p>
        </div>
      )}
      
      {success && (
        <div style={{marginTop: 12, padding: 12, backgroundColor: '#d4edda', color: '#155724', borderRadius: 6}}>
          {success}
        </div>
      )}
      
      {error && (
        <div style={{marginTop: 12, padding: 12, backgroundColor: '#f8d7da', color: '#721c24', borderRadius: 6}}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  )
}