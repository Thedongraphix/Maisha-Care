import Link from 'next/link'
import { whatsappLink } from '@/utils/constants'
import { MessageCircleMore } from 'lucide-react'

const FloatingWhatsApp = () => {
  return (
    <Link 
      href={whatsappLink}
      target='_blank'
      rel="noopener noreferrer"
      className='fixed bottom-6 right-6 bg-green-500 p-4 rounded-full shadow-lg hover:bg-green-600 transition-all hover:scale-110 z-50 cursor-pointer'
    >
      <MessageCircleMore className="w-6 h-6 text-white" />
    </Link>
  )
}

export default FloatingWhatsApp