import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import { SmoothScroll } from './lib/SmoothScroll';
import { Cursor } from './components/ui';

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <Cursor />
        <div aria-hidden="true" className="scanlines" />
        <div aria-hidden="true" className="grain" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </SmoothScroll>
    </BrowserRouter>
  );
}
