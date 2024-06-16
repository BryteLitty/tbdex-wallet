import { BearerDid } from '@web5/dids'
import { Close, Offering, TbdexHttpClient } from '@tbdex/http-client'
import { Jwt, VcDataModel } from '@web5/credentials'
import { PresentationExchange } from '@web5/credentials'


export type ClientExchange = {
  id: string;
  payinAmount: string;
  payinCurrency: string;
  payoutAmount: string;
  payoutCurrency: string;
  status: 'rfq' | 'quote' | 'order' | 'orderstatus' | 'failed' | 'expired' | 'completed',
  createdTime: string,
  expirationTime?: string,
  from: string,
  to: string,
  pfiDid: string
}
// 0. Get credential from issuer
export async function getCredentialFromIssuer(params: { subjectDid: string, data: Record<string, unknown> }) {
  const { subjectDid, data } = params
  // call api and return the credential
  const credential =  await fetch(
                `http://localhost:9000/vc?name=${data.customerName}&country=${data.country}&did=${subjectDid}`,
            ).then((r) => r.text())
  return credential
}

// 1. Set up credential flow by requesting credential from an issuer
export async function requestCredentialFromIssuer(didUri, customerName, country) {
  const credential = await getCredentialFromIssuer({
    subjectDid: didUri,
    data: {
      customerName,
      country
    }
  })
  return credential
}

// 2. Render the credential you obtained from the issuer.
export function renderCredential(credentialJwt: string) {
  const vc: Partial<VcDataModel> = Jwt.parse({ jwt: credentialJwt }).decoded.payload['vc']
  return {
    title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'), // get the last credential type in the array and format it with spaces
    name: vc.credentialSubject['name'],
    countryCode: vc.credentialSubject['countryOfResidence'],
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}

// 3. Fetch offerings from a given PFI to choose from.
export async function fetchOfferings(pfiUri: string) {
  try {
    // TODO: Fetch offerings from the PFI
    const offerings = await TbdexHttpClient.getOfferings({
      pfiDid: pfiUri
    })
    return offerings
  } catch (e) {
    throw new Error(`Error fetching offerings for ${pfiUri}: ${e}`)
  }
}

// 4. Filter offerings based on which credentials the user has to satisfy the requirements.
export function isMatchingOffering(offering: Offering, credentials: string[]) {
  if (credentials.length === 0) return

  try {
    // Validate customer's VCs against the offering's presentation definition
    PresentationExchange.satisfiesPresentationDefinition({
      vcJwts: credentials,
      presentationDefinition: offering.data.requiredClaims,
    })
    return true
  } catch (e) {
    return false
  }
}

// 5. Fetch exchanges between a given user and a given PFI
export async function fetchExchanges(params: {didState: BearerDid, pfiUri: string }) {
  const { didState, pfiUri } = params
  try {
    // TODO 9: Fetch exchanges from the PFI
    const exchanges = await TbdexHttpClient.getExchanges({
      pfiDid: pfiUri,
      did: didState
    })
    const mappedExchanges = exchanges.map(exchange => {
      const latestMessage = exchange[exchange.length - 1]
      const rfqMessage = exchange.find(message => message.kind === 'rfq')
      const quoteMessage = exchange.find(message => message.kind === 'quote')
      console.log('quote', quoteMessage)
      const status = generateExchangeStatusValues(latestMessage)
      const fee = quoteMessage?.data['payin']?.['fee']
      const payinAmount = quoteMessage?.data['payin']?.['amount']
      const payoutPaymentDetails = rfqMessage.privateData?.payout.paymentDetails
      return {
        id: latestMessage.metadata.exchangeId,
        payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
        payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
        payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
        console.log('Quote: ', quoteMessage)
        payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
        status,
        createdTime: rfqMessage.createdAt,
        ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
        from: 'You',
        to: payoutPaymentDetails?.address || payoutPaymentDetails?.accountNumber + ', ' + payoutPaymentDetails?.bankName || payoutPaymentDetails?.phoneNumber + ', ' + payoutPaymentDetails?.networkProvider || 'Unknown',
        pfiDid: rfqMessage.metadata.to
      }
    })
    return mappedExchanges
  } catch (e) {
    throw new Error(`Error fetching exchanges: ${e}`)
  }
}

export function generateExchangeStatusValues(exchangeMessage) {
  if (exchangeMessage instanceof Close) {
    if (exchangeMessage.data.reason.toLowerCase().includes('complete') || exchangeMessage.data.reason.toLowerCase().includes('success') ) {
      return 'completed'
    } else if (exchangeMessage.data.reason.toLowerCase().includes('expired')) {
      return exchangeMessage.data.reason.toLowerCase()
    } else if (exchangeMessage.data.reason.toLowerCase().includes('cancelled')) {
      return 'cancelled'
    } else {
      return 'failed'
    }
  }
  return exchangeMessage.kind
}

export function renderOrderStatus (exchange) {
  const status = generateExchangeStatusValues(exchange)
  switch (status) {
    case 'rfq':
      return 'Requested'
    case 'quote':
      return 'Quoted'
    case 'order':
    case 'orderstatus':
      return 'Pending'
    case 'completed':
      return 'Completed'
    case 'expired':
      return 'Expired'
    case 'cancelled':
      return 'Cancelled'
    case 'failed':
      return 'Failed'
    default:
      return status
  }
}
