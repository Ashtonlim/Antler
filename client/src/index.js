import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { ContextProvider } from './context'

import './scss/main.scss'
import 'antd/dist/antd.css'

ReactDOM.render(
  <React.StrictMode>
    <ContextProvider>
      <App />
    </ContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
