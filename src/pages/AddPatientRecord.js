/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { withApollo, Mutation } from 'react-apollo';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { AuthContext } from '../AuthConfig';
import { GET_HOSPITALS_QUERY } from './AddPatientCase';

const AddPatientRecord = ({ match, client, history }) => {
  const [hospitals, setHospitals] = useState([]);

  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [observation, setObservation] = useState('');
  const [Tx, setTx] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [cevsSp, setCevsSp] = useState(null);
  const [cevsDp, setCevsDp] = useState(null);
  const [cePr, setCePr] = useState(null);
  const [ceRr, setCeRr] = useState(null);
  const [ceHeight, setCeHeight] = useState(null);
  const [ceWeight, setCeWeight] = useState(null);
  const [medication, setMedication] = useState('');
  const [advice, setAdvice] = useState('');
  const [query, setQuery] = useState('');
  const [followUpObservation, setFollowUpObservation] = useState('');

  const {
    authState: {
      mp: { id }
    }
  } = useContext(AuthContext);

  useEffect(() => {
    async function getHospitals() {
      const results = await client.query({
        query: GET_HOSPITALS_QUERY,
        fetchPolicy: 'network-only'
      });
      setHospitals(results.data.getHospitals);
    }
    getHospitals();
  }, []);

  const { patientId, patientCaseId } = match.params;

  const ADD_PATIENT_RECORD_MUTATION = gql`
    mutation addPatientRecord(
      $patientId: String!
      $patientCaseId: String!
      $mpId: String!
      $hospitalId: String!
      $observation: String!
      $Tx: String!
      $suggesstions: String
      $cevsSp: Int!
      $cevsDp: Int!
      $cePr: Int!
      $ceRr: Int!
      $ceHeight: Int!
      $ceWeight: Int!
      $medication: String!
      $advice: String
      $query: String
      $followUpObservation: String
    ) {
      addPatientRecord(
        patientId: $patientId
        patientCaseId: $patientCaseId
        mpId: $mpId
        hospitalId: $hospitalId
        observation: $observation
        Tx: $Tx
        suggesstions: $suggesstions
        cevsSp: $cevsSp
        cevsDp: $cevsDp
        cePr: $cePr
        ceRr: $ceRr
        ceHeight: $ceHeight
        ceWeight: $ceWeight
        medication: $medication
        advice: $advice
        query: $query
        followUpObservation: $followUpObservation
      ) {
        id
        records {
          id
          Tx
        }
      }
    }
  `;

  return (
    <>
      <h3>Add Patient Record</h3>
      <Form onSubmit={e => e.preventDefault()}>
        <Form.Group>
          <Form.Label>Hospital</Form.Label>
          <Form.Control
            as="select"
            required
            onChange={e => setSelectedHospitalId(e.target.value)}
          >
            <option>Select one...</option>
            {hospitals.length > 0 &&
              hospitals.map(({ id, name }, i) => (
                <option key={i} value={id}>
                  {name}
                </option>
              ))}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>observation</Form.Label>
          <Form.Control
            type="text"
            required
            value={observation}
            onChange={e => setObservation(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Tx</Form.Label>
          <Form.Control
            type="text"
            required
            value={Tx}
            onChange={e => setTx(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Suggestions</Form.Label>
          <Form.Control
            type="text"
            value={suggestions}
            onChange={e => setSuggestions(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>cevsSp</Form.Label>
          <Form.Control
            type="number"
            value={cevsSp}
            onChange={e => setCevsSp(Number(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>cevsDp</Form.Label>
          <Form.Control
            type="number"
            value={cevsDp}
            onChange={e => setCevsDp(Number(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>CePr</Form.Label>
          <Form.Control
            type="number"
            value={cePr}
            onChange={e => setCePr(Number(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ceRr</Form.Label>
          <Form.Control
            type="number"
            value={ceRr}
            onChange={e => setCeRr(Number(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ceHeight</Form.Label>
          <Form.Control
            type="number"
            value={ceHeight}
            onChange={e => setCeHeight(Number(e.target.value))}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>ceWeight</Form.Label>
          <Form.Control
            type="number"
            value={ceWeight}
            onChange={e => setCeWeight(Number(e.target.value))}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Medication</Form.Label>
          <Form.Control
            type="text"
            required
            value={medication}
            onChange={e => setMedication(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Advice</Form.Label>
          <Form.Control
            type="text"
            value={advice}
            onChange={e => setAdvice(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Query</Form.Label>
          <Form.Control
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Follow up observation</Form.Label>
          <Form.Control
            type="text"
            required
            value={followUpObservation}
            onChange={e => setFollowUpObservation(e.target.value)}
          />
        </Form.Group>
        <Mutation
          mutation={ADD_PATIENT_RECORD_MUTATION}
          variables={{
            patientId,
            patientCaseId,
            mpId: id,
            hospitalId: selectedHospitalId,
            observation,
            Tx,
            suggesstions: suggestions,
            cevsSp,
            cevsDp,
            cePr,
            ceRr,
            ceHeight,
            ceWeight,
            medication,
            advice,
            query,
            followUpObservation
          }}
          onCompleted={res => {
            console.log(res);
            history.push(`/patient/${patientId}`);
          }}
          onError={err => console.error(err)}
        >
          {addPatientRecord => (
            <Button onClick={addPatientRecord} variant="primary">
              Add Record
            </Button>
          )}
        </Mutation>
      </Form>
    </>
  );
};

export default withRouter(withApollo(AddPatientRecord));
