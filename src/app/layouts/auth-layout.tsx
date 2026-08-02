import { Outlet, ScrollRestoration } from 'react-router-dom';

type Props = {
   children?: React.ReactNode;
};

export default function MainLayout({ children }: Props) {
   return (
      <>
         <ScrollRestoration />

         <div className='flex min-h-screen flex-col'>
            <div className='flex flex-1'>
               <main>{children ?? <Outlet />}</main>
            </div>
         </div>
      </>
   );
}
