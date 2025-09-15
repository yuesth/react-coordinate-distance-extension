import {createRoot} from 'react-dom/client'
import App from './components/App';
import type { ReactNode } from 'react';

const root = createRoot(document.getElementById('root') as any);
root.render(
    <App /> as any
);
