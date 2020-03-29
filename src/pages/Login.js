import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { SET_MP } from '../constants';
import { AuthContext } from '../AuthConfig';
import Spinner from '../components/Spinner';
import { validateEmail } from '../utils';

const LoginPage = ({ history }) => {
  const handleSubmit = event => {
    event.preventDefault();
  };

  const { authDispatch } = useContext(AuthContext);

  const MP_LOGIN_MUTATION = gql`
    mutation medicalPractitionerLogin($email: String!, $password: String!) {
      medicalPractitionerLogin(email: $email, password: $password) {
        token
        medicalPractitioner {
          id
          mpId
          lastName
          firstName
          email
          sex
          registeredAt
          hospital {
            id
            name
          }
          field
          degree
          accessiblePatients {
            id
            firstName
            lastName
            email
          }
        }
      }
    }
  `;

  const _onLogin = data => {
    authDispatch({
      type: SET_MP,
      payload: data.medicalPractitionerLogin
    });
    setLoading(false);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={e => setEmail(e.target.value)}
          value={email}
        />
        <Form.Text className="text-muted">
          We'll never share your email with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Form.Group>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Mutation
        mutation={MP_LOGIN_MUTATION}
        variables={{ email, password }}
        onCompleted={data => _onLogin(data)}
        onError={err => {
          setError('Invalid email or password');
          setLoading(false);
        }}
      >
        {medicalPractitionerLogin => (
          <Button
            variant="primary"
            type="submit"
            style={{ opacity: loading ? 0.7 : 1 }}
            disabled={loading ? true : false}
            onClick={() => {
              setError();
              setLoading(true);
              if (validateEmail(email) && password) {
                medicalPractitionerLogin();
              } else if (!validateEmail(email)) {
                setError('Email is not valid');
                setLoading(false);
              } else {
                setError('Email or password invalid');
                setLoading(false);
              }
            }}
          >
            {loading ? <Spinner /> : 'Login'}
          </Button>
        )}
      </Mutation>
      <hr />
      <p>Not Medical Practitioner?</p>
      <Button as="a" href="https://hl7-admin.netlify.com">
        Go To Admin Page
      </Button>
      {'  '}
      <Button as="a" href="https://hl7-patient.netlify.com">
        Go To Patient Page
      </Button>
    </Form>
  );
};
export default LoginPage;
