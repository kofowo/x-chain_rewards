// Polygon chain information
export const SUPPORTED_CHAINS = {
  POLYGON_TESTNET: {
    id: 80001,
    name: 'Polygon Mumbai',
    explorerUrl: 'https://mumbai.polygonscan.com'
  },
  POLYGON: {
    id: 137,
    name: 'Polygon Mainnet',
    explorerUrl: 'https://polygonscan.com'
  }
}

export function getChainInfo(chainId: number) {
  return Object.values(SUPPORTED_CHAINS).find(chain => chain.id === chainId)
}