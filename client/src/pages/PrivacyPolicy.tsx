import Footer from '../components/Footer'

const PrivacyPolicy = () => {
  return (
    <>
      <div className='max-w-3xl mx-auto px-4 py-16 text-gray-300'>
        <h1 className='text-3xl font-bold text-white mb-6'>Privacy Policy</h1>
        <p className='mb-4 text-sm text-gray-400'>Last updated: {new Date().toLocaleDateString()}</p>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Information We Collect</h2>
          <p>We collect information you provide directly, such as your name, email address, and payment details when you create an account or purchase credits. We also collect usage data related to your use of our Buildora service.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>How We Use Your Information</h2>
          <p>We use your information to provide and improve our services, process payments, communicate with you about your account, and ensure the security of our platform.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Payment Information</h2>
          <p>Payments are processed securely through Razorpay. We do not store your card details on our servers — all payment data is handled directly by Razorpay in compliance with PCI-DSS standards.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Data Sharing</h2>
          <p>We do not sell your personal information. We may share data with third-party service providers (such as payment processors) strictly to operate our service.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Contact Us</h2>
          <p>For any questions about this Privacy Policy, contact us at <a href='mailto:nayakyash420@gmail.com' className='text-indigo-400'>nayakyash420@gmail.com</a>.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default PrivacyPolicy