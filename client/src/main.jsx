import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { SocketProvider } from './context/SocketContext.jsx'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react'; // Import Speed Insights

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <SocketProvider>
    <App />
    <Toaster closeButton/>
    <Analytics />
    <SpeedInsights/>
  </SocketProvider>
  // </StrictMode>,
)
