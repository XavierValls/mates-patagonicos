import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center justify-center text-center bg-gray-100">
      <div className="relative w-full min-h-screen flex items-center justify-center">
        <Image
          src="/images/home2.jpg"
          alt="Mates Patagonicos Banner"
          layout="fill"
          objectFit="cover"
          quality={80}
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

        <div className="relative z-20 p-8 max-w-4xl mx-auto text-white">
          <h1 className="text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
            Mates Patagonicos
          </h1>
          <p className="text-2xl font-light mb-10 drop-shadow-md">
            Autentica experiencia matera desde el corazon de la Patagonia.
            Descubre la calidad y tradicion en cada sorbo.
          </p>
          <Link href="/productos">
            <button className="px-10 py-4 bg-teal-600 text-white text-xl font-bold rounded-full shadow-xl hover:bg-teal-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-75">
              Explorar Productos
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
