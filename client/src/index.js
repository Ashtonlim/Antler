import React from 'react'
import App from './components/App'

import { createRoot } from 'react-dom/client'
import { ContextProvider } from './context'

import './main.css'

import './scss/main.scss'

const root = createRoot(document.getElementById('root'))
root.render(
    <React.StrictMode>
        <ContextProvider>
            <App />
        </ContextProvider>
    </React.StrictMode>
)
