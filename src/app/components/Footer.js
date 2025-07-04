export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white p-6 text-center">
        <div className="container mx-auto">
          <p>&copy; {new Date().getFullYear()} Mates Patagónicos. Todos los derechos reservados.</p>
          <p className="mt-2 text-sm">Hecho con ❤️ en la Patagonia.</p>
        </div>
      </footer>
    );
  }