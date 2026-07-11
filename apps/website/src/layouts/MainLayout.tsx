import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Modals } from '../components/Modals';

export function MainLayout() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <Navbar setActiveModal={setActiveModal} />
      <div className={`main-content ${!isHomePage ? 'pt-navbar' : ''}`}>
        <Outlet />
      </div>
      <Footer setActiveModal={setActiveModal} />
      <Modals activeModal={activeModal} setActiveModal={setActiveModal} />
    </>
  );
}
