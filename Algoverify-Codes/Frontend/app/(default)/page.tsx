export const metadata = {
  title: 'AlgoTrust',
  description: 'Secure. Efficient. Reliable.',
}

import Hero from '@/components/hero'
import Features from '@/components/features'
import Zigzag from '@/components/zigzag'

export default function Home() {
  return (
    <div className='overflow-hidden bg-gradient-to-tl from-black via-zinc-500/10 to-black'>
      <Hero />
      <Features />
      <Zigzag />
    </div>
  )
}
