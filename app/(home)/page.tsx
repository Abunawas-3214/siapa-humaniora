export default function HomePage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Selamat Datang di <span className="text-green-600">SIAPA</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Sistem Informasi Arsip, Persuratan, dan Administrasi <br />
          Fakultas Humaniora UIN Maulana Malik Ibrahim Malang
        </p>

        <div className="mt-8 flex justify-center space-x-4">
          <a
            href="/login"
            className="px-6 py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Masuk Sistem
          </a>
          <a
            href="#about"
            className="px-6 py-3 rounded-lg border border-green-600 text-green-600 font-medium hover:bg-green-50 transition"
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>
    </section>
  )
}
