import { useState } from "react";
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials";
import Blog from "./components/Blog";
import Contact from "./components/Contact";

export default function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <Preloader onComplete={() => setIntroDone(true)} />}

      <Navbar introDone={introDone} />

      <main
        className={`
          transition-opacity duration-700 ease-out
          ${introDone ? "opacity-100" : "opacity-0"}
        `}
      >
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Services />
        <Testimonials />
        <Blog />
        <Contact />
      </main>
    </>
  );
}