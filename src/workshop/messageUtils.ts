/* Use `TbdexHttpClient` to access convenience methods for creating and sending messages */

import { Close, Order, Rfq, TbdexHttpClient, CloseData, CreateRfqData, Offering } from '@tbdex/http-client'
import { BearerDid } from '@web5/dids'

export type SendRfqOptions = CreateRfqData & {
  didState: BearerDid,
  offering: Offering,
  pfiUri: string
}

export type SendOrderOptions = {
  exchangeId: string,
  didState: BearerDid,
  pfiUri: string
}

export type SendCloseOptions = CloseData & {
  exchangeId: string,
  didState: BearerDid,
  pfiUri: string
}

export async function createExchange(opts: SendRfqOptions) {

  const {
    didState,
    pfiUri,
    offeringId,
    payin,
    payout,
    claims,
    offering
  } = opts

  // TODO 5: Create RFQ message
  const rfq = Rfq.create({
    metadata: {
      from: didState.uri,
      to:pfiUri,
      protocol: '1.0'
    },

    data: {
      offeringId,
      payin,
      payout,
      claims
    }
  })


  try{
    // TODO 6: Verify offering requirements with RFQ - rfq.verifyOfferingRequirements(offering)
    rfq.verifyOfferingRequirements(offering)
  } catch (e) {
    // handle failed verification
    console.log('Offering requirements not met', e)
  }

  // TODO 7: Sign RFQ message
  await rfq.sign(didState)
  
  // TODO 8: Submit RFQ message to the PFI .createExchange(rfq)
  await TbdexHttpClient.createExchange(rfq)
}

export async function addOrder(opts: SendOrderOptions) {
  const {
    didState,
    pfiUri,
    exchangeId
  } = opts
  // TODO 11: Create Order message, sign it, and submit it to the PFI
  const order = Order.create(
    {
      metadata: {
        from: didState.uri,
        to: pfiUri,
        exchangeId
      },
    }
  )
}

export async function addClose(opts: SendCloseOptions) {
  const {
    didState,
    pfiUri,
    exchangeId,
    reason
  } = opts

  // TODO 10: Create Close message, sign it, and submit it to the PFI
  const close = Close.create(
    {
      metadata: {
        from: didState.uri,
        to: pfiUri,
        exchangeId
      },
      data: {
        reason
      }
    }
  )
}