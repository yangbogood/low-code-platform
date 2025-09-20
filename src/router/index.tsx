import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EditorPage } from '../pages/EditorPage.tsx';
import { PreviewPageWrapper } from '../pages/PreviewPage.tsx';
import { EmailTemplatePageWrapper } from '../pages/EmailTemplatePage.tsx';
import { NotFoundPage } from '../components/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <EditorPage />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/preview/:pageId?',
    element: <PreviewPageWrapper />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '/email-template',
    element: <EmailTemplatePageWrapper />,
    errorElement: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
