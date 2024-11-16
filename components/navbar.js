import Link from 'next/link'

export default function Navbar() {
  return (
    <div className='flex flex-row justify-center items-center space-x-8 py-4 bg-slate-800'>
      <Link href='/'>
        <h1 className='text-3xl font-bold hover:cursor-pointer text-[#2ae841]'>
          Avis Trade Labs
        </h1>
      </Link>
      <Link href='/'>Play</Link>
      <Link href='/practice'>Practice</Link>
      <Link href='/about'>About</Link>
    </div>
  )
}
