import "../App.css";

export default function Home() {
  return (
    <div className="App">
      <section
        title="header"
        className="bg-green-100/30 text-green-900 flex justify-between items-center py-4 px-6"
      >
        <section className="flex space-x-4">
          <a href="#" className="font-semibold hover:text-green-700">Home</a>
          <a href="#" className="font-semibold hover:text-green-700">Documentation</a>
          <a href="#" className="font-semibold hover:text-green-700">Career</a>
        </section>
        <section>
          <a
            href="/actives"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Launcher Testnet
          </a>
        </section>
      </section>

      <section title="body"></section>
      <section title="footer"></section>
    </div>
  );
}
