import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

import { AuthContext } from '../AuthConfig';
import PatientList from '../components/PatientList';
import Spinner from '../components/Spinner';

const SearchPatients = ({ client }) => {
  const { authState } = useContext(AuthContext);
  const accessiblePatientsIds = authState.mp.accessiblePatients.map(
    patient => patient.id
  );

  const [email, setEmail] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const SEARCH_PATIENTS_QUERY = gql`
    query SearchPatients($email: String!) {
      searchPatients(email: $email) {
        id
        firstName
        lastName
        email
      }
    }
  `;

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    if (email) {
      const results = await client.query({
        query: SEARCH_PATIENTS_QUERY,
        variables: { email },
        fetchPolicy: 'network-only'
      });

      const filteredPatients = results.data.searchPatients.filter(
        patient => !accessiblePatientsIds.includes(patient.id)
      );
      setResults(filteredPatients);
    }
    setLoading(false);
  };

  return (
    <>
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Enter patient email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
            value={email}
          />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{ opacity: loading ? 0.7 : 1 }}
          disabled={loading ? true : false}
          onClick={handleSearch}
        >
          {loading ? <Spinner /> : 'Search'}
        </Button>
      </Form>
      {results.length > 0 ? (
        <>
          <h3>Patients List</h3>
          <PatientList patients={results} accessible={false} />
        </>
      ) : (
        <h3>No patients found</h3>
      )}
    </>
  );
};

export default withApollo(SearchPatients);
