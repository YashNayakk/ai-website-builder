import Footer from '../components/Footer'

const RefundPolicy = () => {
  return (
    <>
      <div className='max-w-3xl mx-auto px-4 py-16 text-gray-300'>
        <h1 className='text-3xl font-bold text-white mb-6'>Refund & Cancellation Policy</h1>
        <p className='mb-4 text-sm text-gray-400'>Last updated: {new Date().toLocaleDateString()}</p>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Credit Purchases</h2>
          <p>Credits purchased on our platform are non-refundable once successfully added to your account, as they grant immediate access to our AI website generation services.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Failed Transactions</h2>
          <p>If a payment is deducted from your account but credits are not added due to a technical error, please contact our support team with your payment ID. We will investigate and issue a refund or add the credits within 5-7 business days.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Duplicate Payments</h2>
          <p>In the rare event of a duplicate charge for the same order, the duplicate amount will be refunded to your original payment method within 7-10 business days.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>How to Request a Refund</h2>
          <p>Contact us at <a href='mailto:yashnayak1209@gmail.com' className='text-indigo-400'>yashnayak1209@gmail.com</a> with your order ID and details of the issue. Refunds, when approved, are processed back to the original payment method via Razorpay.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default RefundPolicy