import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import {Query} from './components/query.jsx'
import Toggle from './components/query.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {Toggle2} from './components/query.jsx'
import {Repo} from "./components/query.jsx"
import {PracticeQuery} from "./components/query.jsx"
import {PostMutation} from './components/query.jsx'


const client = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={client}>
    <App />
    <Query/>
    <Toggle></Toggle>
    <Toggle2></Toggle2>
    <Repo ></Repo>
    <PracticeQuery/>
    <PostMutation></PostMutation>
    <ReactQueryDevtools initialIsOpen={false} />

  </QueryClientProvider>
);
