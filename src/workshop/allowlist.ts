import { mockProviderDids } from '../mocks/mocks'

export interface PfiAllowlistConfig {
  pfiUri: string,
  pfiName: string
}

// TODO 1: Choose the PFIs you want as part of your listings

export const pfiAllowlist: PfiAllowlistConfig[] = [
 
  {
    pfiUri: 
    'did:dht:kdqnzqsoedntcfmcgrxshr7ek93ep1eznfxn1wnkreyy9reewa9o',
    pfiName: "Ace USDC FI"
  }
]