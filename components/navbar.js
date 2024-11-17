import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-row items-center justify-between px-8 py-4 bg-slate-800">
      <Link href="/">
        <h1 className="text-3xl font-bold hover:cursor-pointer text-[#2ae841]">
          Avis Trade Labs
        </h1>
      </Link>
      <div className="flex flex-row gap-x-8">
        <Link href="/">Play</Link>
        <Link href="/practice">Practice</Link>
        <Link href="/about">About</Link>
      </div>
    </div>
  );
}
