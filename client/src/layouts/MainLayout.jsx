import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';

export default function MainLayout() {
  return (
    <div className="main-layout flex flex-col min-h-screen">
      <Navbar />
      <main className="main-content flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
