import Footer from '../components/Footer'
import { Mail, MessageCircle } from 'lucide-react'

const Contact = () => {
  return (
    <>
      <section className='flex flex-col items-center text-white px-4 pb-20 pt-20 font-poppins min-h-[70vh]'>
        <div className='text-center mb-10'>
          <h1 className='text-4xl md:text-5xl font-semibold'>Get in Touch</h1>
          <p className='text-gray-400 text-sm max-w-md mx-auto mt-3'>
            Have a question, need support, or just want to say hi? We'd love to hear from you.
          </p>
        </div>

        <div className='w-full max-w-md bg-black/10 ring ring-indigo-950 rounded-xl p-8 flex flex-col items-center gap-4 hover:ring-indigo-500 transition-all duration-300'>
          <div className='bg-indigo-600/20 p-4 rounded-full'>
            <Mail className='size-6 text-indigo-400' />
          </div>
          <h2 className='text-lg font-medium'>Email Support</h2>
          <p className='text-gray-400 text-sm text-center'>
            For account issues, billing questions, or general inquiries
          </p>
          <a
            href='mailto:nayakyash420@gmail.com'
            className='text-indigo-400 hover:text-indigo-300 transition-colors font-medium'
          >
            nayakyash420@gmail.com
          </a>
        </div>

        <div className='flex items-center gap-2 text-gray-500 text-xs mt-8'>
          <MessageCircle className='size-4' />
          <span>We typically respond within 24-48 hours</span>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default Contact