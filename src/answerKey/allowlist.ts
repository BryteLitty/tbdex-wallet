/* Use `mockProviderDids` to access PFIs and their DID URIs */

import { mockProviderDids } from '../mocks/mocks'

export interface PfiAllowlistConfig {
  pfiUri: string,
  pfiName: string
}

export const pfiAllowlist: PfiAllowlistConfig[] = [
  {
    pfiUri: mockProviderDids.aquafinance_capital.uri,
    pfiName: mockProviderDids.aquafinance_capital.name,
  },
  {
    pfiUri: mockProviderDids.swiftliquidity_solutions.uri,
    pfiName: mockProviderDids.swiftliquidity_solutions.name,
  },
  {
    pfiUri: mockProviderDids.flowback_financial.uri,
    pfiName: mockProviderDids.flowback_financial.name,
  },
  {
    pfiUri: mockProviderDids.vertex_liquid_assets.uri,
    pfiName: mockProviderDids.vertex_liquid_assets.name,
  },
  {
    pfiUri: mockProviderDids.titanium_trust.uri,
    pfiName: mockProviderDids.titanium_trust.name,
  },
  {
    pfiUri: 'did:dht:kdqnzqsoedntcfmcgrxshr7ek93ep1eznfxn1wnkreyy9reewa9o',
    pfiName: 'tbDEX USDC PFI'
  }
]