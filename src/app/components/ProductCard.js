import Image from 'next/image';

export default function ProductCard({ name, description, price, imageUrl, onClick }) {
  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  const finalImageSrc = imageUrl ? `/images/${imageUrl}` : '/images/placeholder.png'; 
  
  const blurDataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

  return (
    <div
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="relative w-full h-48 flex-shrink-0">
        <Image
          src={finalImageSrc}
          alt={name}
          layout="fill"
          objectFit="contain"
          placeholder="blur"
          blurDataURL={blurDataUrl}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{name}</h2>
        <p className="text-gray-600 mb-4 text-base line-clamp-3 flex-grow">{description}</p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <span className="text-2xl font-extrabold text-red-600">${price.toLocaleString('es-AR')}</span>
          <button
            onClick={handleButtonClick}
            className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}
