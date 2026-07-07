import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Modals } from '../components/Modals';

export function MainLayout() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <Navbar setActiveModal={setActiveModal} />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer setActiveModal={setActiveModal} />
      <Modals activeModal={activeModal} setActiveModal={setActiveModal} />
    </>
  );
}
