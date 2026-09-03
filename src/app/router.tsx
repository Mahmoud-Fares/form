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
const DatePickerPage = lazy(() => import('@/app/pages/date-picker'));
const DateRangePage = lazy(() => import('@/app/pages/date-range'));
const TimePage = lazy(() => import('@/app/pages/time'));
const SelectPage = lazy(() => import('@/app/pages/select'));

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
         { path: 'date-picker', element: <DatePickerPage /> },
         { path: 'date-range', element: <DateRangePage /> },
         { path: 'time', element: <TimePage /> },
         { path: 'select', element: <SelectPage /> },
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
