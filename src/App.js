import React, { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { Container } from 'react-bootstrap';

import { AuthContext } from './AuthConfig';
import Router from './Router';
import Header from './components/Header';

function App() {
  const { authState } = useContext(AuthContext);

  const httpLink = createHttpLink({ uri: 'https://hl7-node.herokuapp.com/' });

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
        <Container>
          <Router />
        </Container>
      </ApolloProvider>
    </BrowserRouter>
  );
}

export default App;
