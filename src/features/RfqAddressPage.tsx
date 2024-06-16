import { useContext, useState } from 'react'
import { RfqContext } from './RfqContext'
import { NextButton } from '../common/NextButton'

type RecipientPayoutFormProps = {
  schema: {
    required: string[],
    properties: {
      address?: { title: string },
      accountNumber?: { title: string },
      bankName?: { title: string },
      phoneNumber?: { title: string },
      networkProvider?: { title: string },
    }
  },
  onBack: () => void,
  onNext: () => void
}

export function RfqAddressPage(props: RecipientPayoutFormProps) {
  const { setPaymentDetails } = useContext(RfqContext)
  const [recipientPayoutForm, setRecipientPayoutForm] = useState({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  // Checks if all required properties are filled in the form
  const isInvalidPayoutDetails = props.schema.required.some(requiredProperty => !recipientPayoutForm[requiredProperty])

  const handleNext = () => {
    setHasAttemptedNext(true)
    if (!isInvalidPayoutDetails) {
      setPaymentDetails(recipientPayoutForm)
      props.onNext()
    }
  }

  const handleInputChange = (field, value) => {
    setRecipientPayoutForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <>
      <div className='text-xs mt-2 px-3'>Make sure the information is correct.</div>
      {props.schema.properties.address && (
        <>
          <label className="sr-only" htmlFor="address">Bitcoin Wallet Address</label>
          <input
            type="text"
            id="address"
            name="address"
            className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
            placeholder={props.schema.properties.address.title}
            onChange={(e) => handleInputChange('address', e.target.value)}
            autoComplete='off'
          />
        </>
      )}
      {props.schema.properties.accountNumber && (
        <>
          <label className="sr-only" htmlFor="accountNumber">Account Number</label>
          <input
            type="number"
            id="accountNumber"
            name="accountNumber"
            className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
            placeholder={props.schema.properties.accountNumber.title}
            onChange={(e) => handleInputChange('accountNumber', e.target.value.replace(/[^0-9]/g, ''))}
            autoComplete='off'
          />
        </>
      )}
      {props.schema.properties.bankName && (
        <>
          <label className="sr-only" htmlFor="bankName">Bank Name</label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
            placeholder={props.schema.properties.bankName.title}
            onChange={(e) => handleInputChange('bankName', e.target.value)}
            autoComplete='off'
          />
        </>
      )}
      {props.schema.properties.phoneNumber && (
        <>
          <label className="sr-only" htmlFor="phoneNumber">Phone Number</label>
          <input
            type="tel" // Recommended for phone numbers for better mobile support
            id="phoneNumber"
            name="phoneNumber"
            className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
            placeholder={props.schema.properties.phoneNumber.title}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value.replace(/[^0-9]/g, ''))}
            autoComplete='off'
          />
        </>
      )}
      {props.schema.properties.networkProvider && (
        <>
          <label className="sr-only" htmlFor="networkProvider">Network Provider</label>
          <input
            type="text"
            id="networkProvider"
            name="networkProvider"
            className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
            placeholder={props.schema.properties.networkProvider.title}
            onChange={(e) => handleInputChange('networkProvider', e.target.value)}
            autoComplete='off'
          />
        </>
      )}
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {isInvalidPayoutDetails && hasAttemptedNext && (
          <p className="text-sm text-red-600 mb-2">Improper payout details</p>
        )}
        <NextButton disabled={isInvalidPayoutDetails} onNext={handleNext} />
      </div>
    </>
  )
}
