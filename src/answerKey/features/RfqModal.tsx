import { useState, useContext } from 'react'
import { RfqContext } from './RfqContext'
import { RfqFormIds, getRfqForms } from './RfqForms'
import { BackButton } from '../common/BackButton'
import { Panel } from '../common/Panel'
import { createExchange } from '../workshop/messageUtils'
import '../styles/date.css'
import { useRecoilState } from 'recoil'
import { credentialsState, didState } from '../state'
import { ExchangesContext } from './ExchangesContext'
import { pfiAllowlist } from '../workshop/allowlist'
import { PresentationExchange } from '@web5/credentials'

type RfqModalProps = {
  onClose: () => void;
}
export function RfqModal(props: RfqModalProps) {
  const { setExchangesUpdated } = useContext(ExchangesContext)
  const [step, setStep] = useState(0)
  const { offering, payinAmount, paymentDetails } = useContext(RfqContext)
  const [credentials] = useRecoilState(credentialsState)
  const [did] = useRecoilState(didState)

  const selectedCredentials = PresentationExchange.selectCredentials({
    vcJwts: credentials,
    presentationDefinition: offering.data.requiredClaims,
  })

  const submitRfq = async () => {
    // TODO 3: Create an exchange calling the createExchange function on messageUtils
    await createExchange({
      pfiUri: offering.metadata.from,
      offeringId: offering.id,
      payin: {
        amount: payinAmount,
        kind: offering.data.payin.methods[0].kind,
        paymentDetails: {}
      },
      payout: {
        kind: offering.data.payout.methods[0].kind,
        paymentDetails
      },
      claims: selectedCredentials,
      didState: did,
      offering
    })
    setExchangesUpdated(true)
    props.onClose()
  }

  const handleNext = async () => {
    const currentFormId = forms[step].id
    if (currentFormId === RfqFormIds.Review) {
      await submitRfq()
    } else {
      setStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const forms = getRfqForms(offering, handleNext, handleBack)
  const { title, component } = forms[step]

  return (
    <div className='relative transform overflow-hidden rounded-lg bg-neutral-800 pb-4 pt-5 text-left shadow-xl transition-all w-80 h-auto'>
      <div className='text-white text-center'>
        <h2 className='text-xs leading-6'>
          { pfiAllowlist.find(pfi => pfi.pfiUri === offering.metadata.from).pfiName }
        </h2>
        <h3 className='text-sm font-medium'>
          {offering.data.description}
        </h3>
      </div>
      {step > 0 && (<BackButton onBack={handleBack}/>)}

      <Panel width={'w-80'} height={'h-128'}>
        {!offering ? (
          <p>Something went wrong with the offering.</p>
        ) : (
          <div className="mt-2 text-gray-500 ">
            <h3 className='text-white text-lg font-medium px-3'>{title}</h3>
            {component}
          </div>
        )}
      </Panel>
    </div>
  )
}
