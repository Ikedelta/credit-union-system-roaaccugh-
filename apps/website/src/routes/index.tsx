import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ScrollToTop } from '../components/ScrollToTop';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { JoinNow } from '../pages/JoinNow';
import { ApplyLoan } from '../pages/ApplyLoan';
import { Welfare } from '../pages/Welfare';
import { Events } from '../pages/Events';
import { Gallery } from '../pages/Gallery';
import { About } from '../pages/About';
import { BoardAndManagement } from '../pages/BoardAndManagement';
import { Services } from '../pages/Services';
import { Products } from '../pages/Products';
import { Contact } from '../pages/Contact';
import { Faq } from '../pages/Faq';
import { Branches } from '../pages/Branches';
import { NewsAndBlog } from '../pages/NewsAndBlog';
import { NewsDetail } from '../pages/NewsDetail';
import { ByLaw } from '../pages/ByLaw';
import { PhotoGallery } from '../pages/PhotoGallery';
import { Videos } from '../pages/Videos';
import { Organogram } from '../pages/Organogram';
import { Agm } from '../pages/Agm';

export function AppRouter() {
  return (
    <Router>
      <ScrollToTop />
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
          <Route path="photo-gallery" element={<PhotoGallery />} />
          <Route path="videos" element={<Videos />} />
          <Route path="organogram" element={<Organogram />} />
        </Route>
      </Routes>
    </Router>
  );
}
