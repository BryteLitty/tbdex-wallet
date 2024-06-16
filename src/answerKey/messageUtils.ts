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
  const rfq = Rfq.create(
    {
      metadata: {
        from: didState.uri,
        to: pfiUri,
        protocol: '1.0'
      },
      data: {
        offeringId,
        payin,
        payout,
        claims
      }
    }
  )
  try{
    rfq.verifyOfferingRequirements(offering)
  } catch (e) {
    // handle failed verification
    console.log('Offering requirements not met', e)
  }
  await rfq.sign(didState)
  return await TbdexHttpClient.createExchange(rfq)
}

export async function addOrder(opts: SendOrderOptions) {
  const {
    didState,
    pfiUri,
    exchangeId
  } = opts
  const order = Order.create(
    {
      metadata: {
        from: didState.uri,
        to: pfiUri,
        exchangeId
      },
    }
  )
  await order.sign(didState)
  return await TbdexHttpClient.submitOrder(order)
}

export async function addClose(opts: SendCloseOptions) {
  const {
    didState,
    pfiUri,
    exchangeId,
    reason
  } = opts
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
  await close.sign(didState)
  return await TbdexHttpClient.submitClose(close)
}