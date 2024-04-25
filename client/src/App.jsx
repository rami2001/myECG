import Inscription from "./components/register/Inscription";

function App() {
  return (
    <main className="font-poppins bg-neutral-900 min-h-screen p-6 text-foreground-400 px-12 py-[10vh]">
      <section className="relative bg-background-50 py-10 px-6 rounded-2xl h-[80vh] overflow-auto">
        <Inscription />
      </section>
    </main>
  );
}

export default App;
