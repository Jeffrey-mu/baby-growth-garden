import React from 'react'
import ReactDOM from 'react-dom/client'

import '@fontsource/noto-serif-sc/700.css'
import '@fontsource/noto-sans-sc/400.css'

import 'lxgw-wenkai-webfont/lxgwwenkai-regular.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
