import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RootStoreContext } from './stores/root-store-context.ts'
import RootStore from './stores/root-store.ts'

const store = new RootStore();

(window as any).store = store;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RootStoreContext.Provider value={store}>
    <App />
  </RootStoreContext.Provider>

)
