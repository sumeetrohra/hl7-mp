import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { Container } from 'react-bootstrap';
import firebase from 'firebase/app';
import 'firebase/app';

import { AuthContext } from './AuthConfig';
import Router from './Router';
import Header from './components/Header';

function App() {
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE__DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE__PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
  };
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const { authState } = useContext(AuthContext);

  const httpLink = createHttpLink({
    uri: process.env.REACT_APP_BACKEND_ENDPOINT
  });

  const authLink = setContext((_, { headers }) => {
    const { token } = authState;

    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : null
      }
    };
  });

  const link = authLink.concat(httpLink);

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
  });

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <Header />
        <Container style={{ marginBottom: '30px' }}>
          <Router />
        </Container>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
