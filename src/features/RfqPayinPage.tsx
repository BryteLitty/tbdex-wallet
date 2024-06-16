import { useContext, useState } from 'react'
import { PayinAmountInput } from './RfqPayinAmountInput'
import { RfqContext } from './RfqContext'
import { NextButton } from '../common/NextButton'
import { TBD } from '../currency-utils'
import { useRecoilState } from 'recoil'
import { balanceState } from '../state'
import { useNavigate } from 'react-router-dom'


import { isMatchingOffering } from '../api-utils.js'
import { credentialsState } from '../state.ts'


type SetQuoteAmountFormProps = {
  onNext: () => void;
}

export function PayinPage(props: SetQuoteAmountFormProps) {
  const navigate = useNavigate()
  const {offering, payinAmount, setPayinAmount, payoutAmount, setPayoutAmount} = useContext(RfqContext)
  const [currentPayoutAmount, setCurrentPayoutAmount] = useState(payoutAmount)
  const [currentPayinAmount, setCurrentPayinAmount] = useState(payinAmount)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const [accountBalance] = useRecoilState(balanceState)
  const [credentials] = useRecoilState(credentialsState)

  const needsCredential = !isMatchingOffering(offering, credentials)

  const minPayinAmount = offering.data.payin.min ? TBD(offering.data.payin.min).value : 0.01
  const maxPayinAmount = offering.data.payin.max ? TBD(offering.data.payin.max).value : accountBalance || 5

  const isWithinMinMax = (amount: string, minQuoteAmount: number, maxQuoteAmount: number) => {
    const parsedAmount = parseFloat(amount)

    if (minQuoteAmount < 0 && maxQuoteAmount < 0) {
        return true
    }

    const isAmountWithinMinBounds = minQuoteAmount < 0 || parsedAmount >= minQuoteAmount
    const isAmountWithinMaxBounds = maxQuoteAmount < 0 || parsedAmount <= maxQuoteAmount

    return isAmountWithinMinBounds && isAmountWithinMaxBounds
  }
  const [isAmountValid, setIsAmountValid] = useState(isWithinMinMax(currentPayinAmount, minPayinAmount, maxPayinAmount))

  const validateAmount = (amount: string) => {
    setIsAmountValid(isWithinMinMax(amount, minPayinAmount, maxPayinAmount))
  }


  const handleNext = () => {
    setHasAttemptedNext(true)
    if (isNaN(parseFloat(currentPayoutAmount))) return

    if (isAmountValid) {
      setPayoutAmount(currentPayoutAmount)
      setPayinAmount(currentPayinAmount)
      props.onNext()
    }
  }

  const handleCredentialRequest = () => {
    console.log('requesting credential')
    navigate('/get-credentials')
  }

  return (
    <>
      <PayinAmountInput
        minPayinAmount={minPayinAmount}
        maxPayinAmount={maxPayinAmount}
        isAmountValid={isAmountValid}
        validateAmount={validateAmount}
        currentPayinAmount={currentPayinAmount}
        setCurrentPayinAmount={setCurrentPayinAmount}
        currentPayoutAmount={currentPayoutAmount}
        setCurrentPayoutAmount={setCurrentPayoutAmount}
      />

      <div className="mx-8 fixed inset-x-0 bottom-6 z-10 flex flex-col items-center justify-center">
        {(currentPayoutAmount === '' && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Enter an amount in {offering.data.payin.currencyCode}</p>
        )}
        {needsCredential && (
          <>
            <p className="text-sm text-center text-red-600 mb-2">Credential missing</p>
            <button
              type='submit'
              className="rounded-2xl bg-indigo-500 w-full px-3 py-2 mb-2 text-sm font-semibold text-white shadow-sm enabled:hover:bg-indigo-400 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              onClick={handleCredentialRequest}
            >
            Verify Identity
        </button>
        </>
        )}
        <NextButton disabled={needsCredential} onNext={handleNext} />
      </div>
    </>
  )
}
