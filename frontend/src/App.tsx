import {
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';

import { PromptPage } from './pages/prompt';
import { RootPage } from './pages/root';
import { CreatePage } from './pages/create';
import { EditPage } from './pages/edit';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <RootPage />,
  },
  {
    path: '/create',
    element: <CreatePage />,
  },
  {
    path: '/prompt',
    element: <PromptPage />,
  },
  {
    path: '/edit',
    element: <EditPage />,
  },
];

function App() {
  return <RouterProvider router={createBrowserRouter(routes)} />;
}

export default App;