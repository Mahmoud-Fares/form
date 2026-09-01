import { lazy } from 'react';

import { createBrowserRouter } from 'react-router-dom';

import ErrorBoundary from '@/shared/components/error-boundary';

const MainLayout = lazy(() => import('@/app/layouts/main-layout'));
const ProtectedLayout = lazy(() => import('@/app/layouts/protected-layout'));
const AuthLayout = lazy(() => import('@/app/layouts/auth-layout'));

const Home = lazy(() => import('@/app/pages/home'));
const TextPage = lazy(() => import('@/app/pages/text'));
const SchedulePage = lazy(() => import('@/app/pages/schedule'));
const CheckboxPage = lazy(() => import('@/app/pages/checkbox'));
const MultiTabs = lazy(() => import('@/app/pages/multi-tabs'));

const NotFound = lazy(() => import('@/app/pages/not-found'));

export const router = createBrowserRouter([
   {
      path: '/',
      element: <MainLayout />,
      errorElement: <ErrorBoundary />,
      children: [
         { index: true, element: <Home /> },
         { path: 'text', element: <TextPage /> },
         { path: 'schedule', element: <SchedulePage /> },
         { path: 'checkbox', element: <CheckboxPage /> },
         { path: 'multi-tabs', element: <MultiTabs /> },
         { path: '*', element: <NotFound /> },
      ],
   },

   // Protected routes group
   {
      path: '/',
      element: <ProtectedLayout />,
      errorElement: <ErrorBoundary />,
   },

   // Auth routes group
   {
      path: '/',
      element: <AuthLayout />,
      errorElement: <ErrorBoundary />,
   },
]);
