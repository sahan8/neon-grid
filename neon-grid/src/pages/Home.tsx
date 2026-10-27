import { useState } from 'react';
import { Loader } from '../sections/Loader';
import { Hero } from '../sections/Hero';
import { Districts } from '../sections/Districts';
import { Augments } from '../sections/Augments';
import { Characters } from '../sections/Characters';
import { Lore } from '../sections/Lore';
import { Gallery } from '../sections/Gallery';
import { Join } from '../sections/Join';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { ScrollProgress } from '../components/layout/ScrollProgress';

export default function Home() {
  const [entered, setEntered] = useState(false);
  return (
    <>
      <a href="#main" className="sr-only z-[200] bg-cyan px-4 py-3 font-bold text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <Loader onEnter={() => setEntered(true)} />
      <ScrollProgress />
      <Nav />
      <main id="main">
        <Hero entered={entered} />
        <Districts />
        <Augments />
        <Characters />
        <Lore />
        <Gallery />
        <Join />
      </main>
      <Footer />
    </>
  );
}
