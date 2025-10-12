import ProductGrid from '@/components/ProductGrid'
import RadioPanel from '@/components/RadioPanel'

export default function Home(){
  return (<div className='space-y-10'>
    <section className='grid md:grid-cols-[280px,1fr] gap-6 items-start'>
      <RadioPanel/>
      <div className='text-center'>
        <h2 className='text-3xl font-bold mb-2'>Smart Tech. Smart Dropshipping.</h2>
        <p className='text-gray-400'>Prémiové gadgety s rychlou dopravou v EU a podporou 24/7.</p>
      </div>
    </section>
    <section className='card p-6 fade-up'>
      <h3 className='text-2xl font-semibold mb-2 text-center'>Top produkty</h3>
      <ProductGrid/>
    </section>
  </div>)
}
