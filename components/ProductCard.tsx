import Image from 'next/image'
type Product={id:number;title:string;price:string;currency:string;image:string;description:string;badge?:string}
export default function ProductCard({p}:{p:Product}){
  return (<div className="card p-4 flex flex-col hover:-translate-y-0.5 transition ease-out fade-up">
    <div className="relative w-full h-48 mb-3 overflow-hidden rounded-xl"><Image src={p.image} alt={p.title} fill className="object-cover"/></div>
    <div className="flex items-center justify-between mb-1"><h3 className="text-lg font-semibold">{p.title}</h3>{p.badge&&<span className="badge">{p.badge}</span>}</div>
    <p className="text-sm text-gray-400 mb-2 text-center">{p.description}</p>
    <div className="price-red text-lg">{p.price}</div>
    <div className="flex items-center justify-center mt-3"><button className="btn">🛒 Koupit</button></div>
  </div>)
}
