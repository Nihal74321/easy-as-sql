import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import HomeComponent from './components/home.jsx'
import Documentation from './documentation.jsx'
import DocumentVideo from './documentation-video.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <Documentation /> */}
    <HomeComponent/>
    {/* <DocumentVideo /> */}
  </StrictMode>,
)