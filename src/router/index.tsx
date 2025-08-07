import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import ScriptEditor from '../pages/ScriptEditor';
import ScriptNew from '../pages/ScriptNew';
import TemplateLibrary from '../pages/TemplateLibrary';
import TestResults from '../pages/TestResults';
import NotFound from '../pages/NotFound';

function AuthenticatedApp() {
  const router = createBrowserRouter([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: '',
          element: <Navigate to="/dashboard" replace />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'scripts',
          element: <ScriptEditor />,
        },
        {
          path: 'scripts/new',
          element: <ScriptNew />,
        },
        {
          path: 'scripts/editor',
          element: <ScriptEditor />,
        },
        {
          path: 'scripts/:scriptId',
          element: <ScriptEditor />,
        },
        {
          path: 'templates',
          element: <TemplateLibrary />,
        },
        {
          path: 'templates/:templateId',
          element: <TemplateLibrary />,
        },
        {
          path: 'test-results',
          element: <TestResults />,
        },
        {
          path: 'test-results/:testId',
          element: <TestResults />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default function AppRouter() {
  return <AuthenticatedApp />;
}