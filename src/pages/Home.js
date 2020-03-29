/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Form } from 'react-bootstrap';

import PatientList from '../components/PatientList';
import Spinner from '../components/Spinner';

const Home = ({ client }) => {
  const [accessiblePatients, setAccessiblePatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const GET_ACCESSIBLE_PATIENTS_QUERY = gql`
    query getAccessiblePatients {
      getAccessiblePatients {
        id
        firstName
        lastName
        email
      }
    }
  `;

  useEffect(() => {
    async function getPatients() {
      setLoading(true);
      try {
        const results = await client.query({
          query: GET_ACCESSIBLE_PATIENTS_QUERY,
          fetchPolicy: 'network-only'
        });
        setAccessiblePatients(results.data.getAccessiblePatients);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    }
    getPatients();
  }, []);

  const handleSearch = e => {
    const searchText = e.target.value;
    setError('');
    setFilteredPatients([]);
    if (searchText.length > 0) {
      const results = accessiblePatients.filter(el =>
        el.email.match(searchText)
      );
      results.length > 0
        ? setFilteredPatients(results)
        : setError('No Patient found');
    } else {
      setFilteredPatients([]);
      setError('');
    }
  };

  return (
    <>
      {!loading ? (
        <h3>Accessible Patients</h3>
      ) : (
        <>
          <p>Loading Patients...</p>
          <Spinner />
        </>
      )}
      {accessiblePatients.length > 0 && (
        <Form onSubmit={e => e.preventDefault()}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Enter patient email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              onChange={handleSearch}
            />
          </Form.Group>
        </Form>
      )}
      {error && <p>{error}</p>}
      {filteredPatients.length > 0 && !error && (
        <PatientList patients={filteredPatients} accessible={true} />
      )}
      {accessiblePatients.length > 0 &&
        filteredPatients.length === 0 &&
        !error && (
          <PatientList patients={accessiblePatients} accessible={true} />
        )}
    </>
  );
};

export default withApollo(Home);
