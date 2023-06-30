import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink, ApolloLink } from '@apollo/client';
import SessionSelect from './pages/SessionSelect';
import { Router, RouterSwitch } from './components/RouterSwitch';
import { setContext } from "@apollo/client/link/context";
import Dashboard from './components/Dashboard';

const authLink = setContext(async() => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      headers: {
        authorization: `Bearer ${token}`
      }
    }
  }
});

const link = ApolloLink.from([
  authLink,
  new HttpLink({
    // uri: 'https://rlt066much.execute-api.ap-southeast-2.amazonaws.com/',
    uri: "http://localhost:4000"
  })
])

const client = new ApolloClient({
  link,  
  cache: new InMemoryCache({
    addTypename: false
  })
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Dashboard>
        <Router />
      </Dashboard>
    </ApolloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
