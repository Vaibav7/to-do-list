import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./pages/home";


function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-100">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;
