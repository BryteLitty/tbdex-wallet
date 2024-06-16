import { useContext, useState } from 'react'
import { RfqContext } from './RfqContext'
import { formatUnits, money } from '../currency-utils'
import { Spinner } from '../common/Spinner'

type ReviewPageProps = {
  onSubmit: () => void;
  onBack: () => void;
}

export function ReviewPage(props: ReviewPageProps) {
  const {
    offering,
    payinAmount,
    payoutAmount,
    paymentDetails
  } = useContext(RfqContext)

  const payinCurrency = offering?.data.payin.currencyCode
  const payoutCurrency = offering?.data.payout.currencyCode
  const payinUnits = money(payinAmount).format()
  const payoutUnits = formatUnits(payoutAmount, 8)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    props.onSubmit()
  }

  const getPaymentDetailsDisplay = () => {
    // Checks and formats the available payment details into a readable string
    const details = []
    if (paymentDetails?.address) details.push(`${paymentDetails.address}`)
    if (paymentDetails?.accountNumber) details.push(`Account Number: ${paymentDetails.accountNumber}`)
    if (paymentDetails?.bankName) details.push(`Bank Name: ${paymentDetails.bankName}`)
    if (paymentDetails?.phoneNumber) details.push(`Phone Number: ${paymentDetails.phoneNumber}`)
    if (paymentDetails?.networkProvider) details.push(`Network Provider: ${paymentDetails.networkProvider}`)

    // Returns either the concatenated string of details or a default message
    return details.length > 0 ? details.join(', ') : 'No payment details provided'
  }

  return (
    <>
      <p className='text-xs mt-2 px-3'>Make sure to check the amount and delivery info before sending.</p>

      <div className="mt-6 text-gray-500">
        <p className='text-white text-sm font-medium px-3'>{payinUnits} {payinCurrency}</p>
        <p className='text-xs mt-1 px-3'>Transfer amount</p>
      </div>
      <div className="mt-3 text-gray-500">
        <p className='text-white text-sm font-medium px-3'>{payoutUnits} {payoutCurrency}</p>
        <p className='text-xs mt-1 px-3'>Total to you</p>
      </div>

      <div className="mt-4 text-gray-400">
        <div className='text-xs font-small px-3'>
          <p className='text-white'>{offering.data.payout.methods[0].kind}</p>
        </div>
        <p className='text-xs px-3 mt-1'>{getPaymentDetailsDisplay()}</p>
      </div>

      <div className="mx-8 fixed inset-x-0 bottom-6 z-10 flex justify-center">
        {isSubmitting ?
          <Spinner></Spinner>
        : <button
          type="submit"
          className="rounded-2xl bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleSubmit}
        >
          Request
        </button>
        }
      </div>
    </>
  )
}
