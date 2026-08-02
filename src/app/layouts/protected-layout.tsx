import { Outlet } from 'react-router-dom';

import MainLayout from '@/app/layouts/main-layout';

export default function ProtectedLayout() {
   return (
      <MainLayout>
         <Outlet />
      </MainLayout>
   );
}
