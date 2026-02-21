import { Outlet } from 'react-router-dom';
import Logo from '../../public/logo.png';

export default function AuthLayout() {
  return (
    <>
      <img src={Logo} alt="Logo" className="w-12 h-12 absolute top-5 left-5" />
      <Outlet />
    </>
  );
}
