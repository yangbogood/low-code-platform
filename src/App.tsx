import React from 'react';
import { AppRouter } from './router';
import { ErrorBoundary } from './components/ErrorBoundary';

// 主应用组件
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppRouter />
    </ErrorBoundary>
  );
};

export { App };
export default App;
