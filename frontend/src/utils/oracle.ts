import { contractCallOracleConfirm } from './stacks'

// Mock oracle for demo purposes
export async function mockOracleConfirm(
  id: number, 
  destHash: string,
  oracleAddress: string
): Promise<string> {
  console.log('Oracle confirming lock:', { id, destHash })
  
  // Simulate Polygon mint
  await new Promise(resolve => setTimeout(resolve, 1000))
  const mockTxHash = '0x' + Math.random().toString(16).substring(2, 66).padStart(64, '0')
  
  // Call oracle-confirm with mock transaction hash
  const txId = await contractCallOracleConfirm(id, mockTxHash, oracleAddress)
  return txId
}