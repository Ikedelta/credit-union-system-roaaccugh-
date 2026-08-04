import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '../components/ScrollToTop';
import { MainLayout } from '../layouts/MainLayout';
import { Loader2 } from 'lucide-react';

const Home = lazy(() => import('../pages/Home').then(m => ({ default: m.Home })));
const JoinNow = lazy(() => import('../pages/JoinNow').then(m => ({ default: m.JoinNow })));
const ApplyLoan = lazy(() => import('../pages/ApplyLoan').then(m => ({ default: m.ApplyLoan })));
const Welfare = lazy(() => import('../pages/Welfare').then(m => ({ default: m.Welfare })));
const Events = lazy(() => import('../pages/Events').then(m => ({ default: m.Events })));
const Gallery = lazy(() => import('../pages/Gallery').then(m => ({ default: m.Gallery })));
const About = lazy(() => import('../pages/About').then(m => ({ default: m.About })));
const BoardAndManagement = lazy(() => import('../pages/BoardAndManagement').then(m => ({ default: m.BoardAndManagement })));
const Services = lazy(() => import('../pages/Services').then(m => ({ default: m.Services })));
const Products = lazy(() => import('../pages/Products').then(m => ({ default: m.Products })));
const Contact = lazy(() => import('../pages/Contact').then(m => ({ default: m.Contact })));
const Faq = lazy(() => import('../pages/Faq').then(m => ({ default: m.Faq })));
const Branches = lazy(() => import('../pages/Branches').then(m => ({ default: m.Branches })));
const NewsAndBlog = lazy(() => import('../pages/NewsAndBlog').then(m => ({ default: m.NewsAndBlog })));
const NewsDetail = lazy(() => import('../pages/NewsDetail').then(m => ({ default: m.NewsDetail })));
const ByLaw = lazy(() => import('../pages/ByLaw').then(m => ({ default: m.ByLaw })));
const OperationalPolicy = lazy(() => import('../pages/OperationalPolicy').then(m => ({ default: m.OperationalPolicy })));
const PhotoGallery = lazy(() => import('../pages/PhotoGallery').then(m => ({ default: m.PhotoGallery })));
const Videos = lazy(() => import('../pages/Videos').then(m => ({ default: m.Videos })));
const Organogram = lazy(() => import('../pages/Organogram').then(m => ({ default: m.Organogram })));
const Agm = lazy(() => import('../pages/Agm').then(m => ({ default: m.Agm })));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', gap: '1rem', background: '#f8fafc' }}>
    <Loader2 size={48} className="spinner" style={{ color: 'var(--primary-color)' }} />
    <h3 style={{ color: 'var(--text-color)', margin: 0 }}>Loading...</h3>
  </div>
);

export function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="board-and-management" element={<BoardAndManagement />} />
            <Route path="news" element={<NewsAndBlog />} />
            <Route path="news/:id" element={<NewsDetail />} />
            <Route path="services" element={<Services />} />
            <Route path="products" element={<Products />} />
            <Route path="contact" element={<Contact />} />
            <Route path="branches" element={<Branches />} />
            <Route path="faq" element={<Faq />} />
            <Route path="join-now" element={<JoinNow />} />
            <Route path="apply-loan" element={<ApplyLoan />} />
            <Route path="welfare" element={<Welfare />} />
            <Route path="events" element={<Events />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="agm" element={<Agm />} />
            <Route path="bylaw" element={<ByLaw />} />
            <Route path="operational-policy" element={<OperationalPolicy />} />
            <Route path="photo-gallery" element={<PhotoGallery />} />
            <Route path="videos" element={<Videos />} />
            <Route path="organogram" element={<Organogram />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
