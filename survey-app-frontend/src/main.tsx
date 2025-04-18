import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from "@/components/ui/provider"
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// const theme = extendTheme({});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
