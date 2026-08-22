import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Lock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='w-full border-t border-white/10 mt-24 bg-black/20'>

      {/* Trust badges */}
      <div className='max-w-6xl mx-auto px-6 pt-10 pb-6'>
        <div className='flex flex-wrap items-center justify-center gap-x-10 gap-y-4'>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <Lock className='size-4 text-indigo-400' />
            <span>Secure Payments via Razorpay</span>
          </div>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <ShieldCheck className='size-4 text-indigo-400' />
            <span>Auth by Better Auth</span>
          </div>
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <Zap className='size-4 text-indigo-400' />
            <span>Powered by AI</span>
          </div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-10 border-t border-white/5'>

        {/* Brand */}
        <div className='max-w-xs'>
          <h3 className='text-white font-semibold text-lg mb-2'>Buildora</h3>
          <p className='text-gray-400 text-sm leading-relaxed'>
            Turn thoughts into websites instantly with AI. Create, customize, and publish faster than ever.
          </p>
        </div>

        {/* Links */}
        <div className='flex flex-wrap gap-10 md:gap-16'>
          <div>
            <h4 className='text-white text-sm font-medium mb-3'>Product</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li><Link to='/pricing' className='hover:text-white transition-colors'>Pricing</Link></li>
              <li><Link to='/' className='hover:text-white transition-colors'>Home</Link></li>
              <li><Link to='/projects' className='hover:text-white transition-colors'>My Projects</Link></li>
            </ul>
          </div>

          <div>
            <h4 className='text-white text-sm font-medium mb-3'>Legal</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li><Link to='/privacy-policy' className='hover:text-white transition-colors'>Privacy Policy</Link></li>
              <li><Link to='/refund-policy' className='hover:text-white transition-colors'>Refund Policy</Link></li>
              <li><Link to='/terms-and-conditions' className='hover:text-white transition-colors'>Terms & Conditions</Link></li>
            </ul>
          </div>

          <div>
            <h4 className='text-white text-sm font-medium mb-3'>Support</h4>
            <ul className='space-y-2 text-sm text-gray-400'>
              <li><Link to='/contact' className='hover:text-white transition-colors'>Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className='border-t border-white/10'>
        <p className='text-center text-gray-500 text-xs py-4'>
          © {new Date().getFullYear()} Buildora by orche. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer