import Footer from '../components/Footer'

const TermsAndConditions = () => {
  return (
    <>
      <div className='max-w-3xl mx-auto px-4 py-16 text-gray-300'>
        <h1 className='text-3xl font-bold text-white mb-6'>Terms & Conditions</h1>
        <p className='mb-4 text-sm text-gray-400'>Last updated: {new Date().toLocaleDateString()}</p>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Use of Service</h2>
          <p>By using our AI Website Builder, you agree to use the platform only for lawful purposes and in accordance with these terms.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Credits & Payments</h2>
          <p>Our platform operates on a credit-based system. Credits are purchased through Razorpay and consumed per project creation or revision, as described on our Pricing page.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Account Responsibility</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Limitation of Liability</h2>
          <p>Our service is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from use of the platform.</p>
        </section>

        <section className='mb-6'>
          <h2 className='text-xl font-semibold text-white mb-2'>Changes to Terms</h2>
          <p>We reserve the right to update these terms at any time. Continued use of the service after changes constitutes acceptance of the updated terms.</p>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default TermsAndConditions