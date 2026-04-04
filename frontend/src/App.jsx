import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Route-based code splitting — each page loads as a separate JS chunk
const Home = lazy(() => import('./pages/Home'));
const Blogs = lazy(() => import('./pages/Blogs'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Tournament = lazy(() => import('./pages/Tournament'));

// Loading fallback shown between page navigations
function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-bg-dark z-40">
      <div className="flex flex-col items-center gap-4">
        <span className="material-symbols-outlined text-primary text-5xl animate-spin">sports_esports</span>
        <span className="text-xs font-bold tracking-[0.3em] uppercase text-gray-400">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:id" element={<BlogDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/tournament" element={<Tournament />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;
