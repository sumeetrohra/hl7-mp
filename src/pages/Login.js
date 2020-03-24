import React, { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

import { SET_MP } from '../constants';
import { AuthContext } from '../AuthConfig';

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
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      <Mutation
        mutation={MP_LOGIN_MUTATION}
        variables={{ email, password }}
        onCompleted={data => _onLogin(data)}
        onError={err => console.error(err)}
      >
        {mutation => (
          <Button variant="primary" type="submit" onClick={mutation}>
            Submit
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
