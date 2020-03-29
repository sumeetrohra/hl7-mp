import React, { useState } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Card, Button, Toast } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import Spinner from '../components/Spinner';

const PatientCard = ({
  patient: { firstName, lastName, email, id },
  accessible,
  history
}) => {
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(false);

  const ASK_ACCESS_MUTATION = gql`
    mutation requestPatientAccess($id: String!) {
      requestPatientAccess(patientId: $id) {
        id
        medicalPractitionerFirstName
        medicalPractitionerLastName
        medicalPractitionerId
      }
    }
  `;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{`${firstName} ${lastName}`}</Card.Title>
        <Card.Text>{email}</Card.Text>
        {!accessible ? (
          <Mutation
            mutation={ASK_ACCESS_MUTATION}
            variables={{ id }}
            onCompleted={res => {
              console.log(res);
              setLoading(false);
              setShowToast(true);
            }}
            onError={err => {
              setLoading(false);
            }}
          >
            {requestPatientAccess => (
              <Button
                variant="primary"
                style={{ opacity: loading ? 0.7 : 1 }}
                disabled={loading ? true : false}
                onClick={() => {
                  setLoading(true);
                  requestPatientAccess();
                }}
              >
                {loading ? <Spinner /> : 'Ask Access'}
              </Button>
            )}
          </Mutation>
        ) : (
          <Button
            variant="primary"
            onClick={() => history.push(`/patient/${id}`)}
          >
            Get patient details
          </Button>
        )}
      </Card.Body>
      <div style={{ display: showToast ? 'inherit' : 'none' }}>
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded mr-2"
              alt=""
            />
            <strong className="mr-auto">Request successful</strong>
          </Toast.Header>
          <Toast.Body>{`Successfully requested patient: ${email}`}</Toast.Body>
        </Toast>
      </div>
    </Card>
  );
};

export default withRouter(PatientCard);
