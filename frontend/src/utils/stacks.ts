import { 
  AnchorMode, 
  callReadOnlyFunction, 
  PostConditionMode, 
  uintCV, 
  bufferCV,
  cvToString,
  PostCondition,
  makeStandardSTXPostCondition,
  FungibleConditionCode
} from '@stacks/transactions'
import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network'
import { openContractCall } from '@stacks/connect'

// Configuration
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
const contractName = import.meta.env.VITE_CONTRACT_NAME || 'cross-chain-bridge'
const networkName = (import.meta.env.VITE_STACKS_NETWORK || 'testnet').toLowerCase()

export const network: StacksNetwork = networkName === 'mainnet' ? new StacksMainnet() : new StacksTestnet()

// Contract interaction functions
export async function getAdmin(): Promise<string> {
  try {
    const result = await callReadOnlyFunction({
      contractAddress,
      contractName,
      functionName: 'get-admin',
      functionArgs: [],
      senderAddress: contractAddress,
      network
    })
    return cvToString(result)
  } catch (error) {
    console.error('Error getting admin:', error)
    throw error
  }
}

export async function contractCallLock(
  amountUstx: number, 
  recipientEvm: string, 
  targetChain: number,
  senderAddress: string
): Promise<string> {
  try {
    // Validate inputs
    if (amountUstx <= 0) throw new Error('Amount must be greater than 0')
    if (!recipientEvm.startsWith('0x')) throw new Error('Recipient must be a valid EVM address')
    
    // Remove 0x prefix and convert to buffer
    const recipientHex = recipientEvm.slice(2)
    const recipientBytes = Buffer.from(recipientHex, 'hex')
    
    // Create post condition to ensure user has enough STX
    const postConditions: PostCondition[] = [
      makeStandardSTXPostCondition(
        senderAddress,
        FungibleConditionCode.LessEqual,
        amountUstx
      )
    ]

    // Open contract call with wallet
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'lock-stx',
      functionArgs: [
        uintCV(amountUstx),
        bufferCV(recipientBytes),
        uintCV(targetChain)
      ],
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
      network,
      onFinish: (data: any) => {
        console.log('Transaction submitted:', data)
      },
      onCancel: () => {
        console.log('Transaction cancelled')
      }
    }

    return new Promise((resolve, reject) => {
      openContractCall({
        ...txOptions,
        onFinish: (data: any) => {
          console.log('Lock transaction submitted:', data)
          resolve(data.txId)
        },
        onCancel: () => {
          reject(new Error('Transaction cancelled by user'))
        }
      })
    })
  } catch (error) {
    console.error('Error locking STX:', error)
    throw error
  }
}

export async function contractCallOracleConfirm(
  lockId: number,
  destTxHash: string,
  senderAddress: string
): Promise<string> {
  try {
    // Remove 0x prefix if present and convert to buffer
    const txHashHex = destTxHash.startsWith('0x') ? destTxHash.slice(2) : destTxHash
    const txHashBytes = Buffer.from(txHashHex, 'hex')

    // Open contract call with wallet
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'oracle-confirm',
      functionArgs: [
        uintCV(lockId),
        bufferCV(txHashBytes)
      ],
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
      network
    }

    return new Promise((resolve, reject) => {
      openContractCall({
        ...txOptions,
        onFinish: (data: any) => {
          console.log('Oracle confirm transaction submitted:', data)
          resolve(data.txId)
        },
        onCancel: () => {
          reject(new Error('Transaction cancelled by user'))
        }
      })
    })
  } catch (error) {
    console.error('Error confirming oracle:', error)
    throw error
  }
}

export async function contractCallRefund(
  lockId: number,
  senderAddress: string
): Promise<string> {
  try {
    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'refund',
      functionArgs: [uintCV(lockId)],
      postConditionMode: PostConditionMode.Allow,
      anchorMode: AnchorMode.Any,
      network
    }

    return new Promise((resolve, reject) => {
      openContractCall({
        ...txOptions,
        onFinish: (data: any) => {
          console.log('Refund transaction submitted:', data)
          resolve(data.txId)
        },
        onCancel: () => {
          reject(new Error('Transaction cancelled by user'))
        }
      })
    })
  } catch (error) {
    console.error('Error requesting refund:', error)
    throw error
  }
}

// Utility function to get transaction status
export async function getTransactionStatus(txId: string): Promise<any> {
  try {
    const response = await fetch(`${network.coreApiUrl}/extended/v1/tx/${txId}`)
    return await response.json()
  } catch (error) {
    console.error('Error getting transaction status:', error)
    throw error
  }
}