export default function Footer() {
  return (
    <footer className="bg-white mt-12 border-t">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} NU-Store — All rights reserved.
      </div>
    </footer>
  );
}
