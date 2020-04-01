/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { withApollo, Mutation } from 'react-apollo';
import { Form, Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';

import { AuthContext } from '../AuthConfig';
import { GET_HOSPITALS_QUERY } from './AddPatientCase';
import Spinner from '../components/Spinner';

const AddPatientRecord = ({ match, client, history }) => {
  const [hospitals, setHospitals] = useState([]);

  const [eventType, setEventType] = useState('');
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

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
      $eventType: String!
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
        eventType: $eventType
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
          <Form.Label>Event Type</Form.Label>
          <Form.Control
            as="select"
            required
            onChange={e => setEventType(e.target.value)}
          >
            <option>Select one...</option>
            <option value={'Admit'}>Admit</option>
            <option value={'Discharge'}>Discharge</option>
            <option value={'Transfer'}>Transfer</option>
          </Form.Control>
        </Form.Group>
        {hospitals.length > 0 ? (
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
        ) : (
          <>
            <p>Loading Hospitals</p>
            <Spinner />
          </>
        )}
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
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Mutation
          mutation={ADD_PATIENT_RECORD_MUTATION}
          variables={{
            patientId,
            patientCaseId,
            mpId: id,
            hospitalId: selectedHospitalId,
            eventType,
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
            setLoading(false);
            const records = res.addPatientRecord.records;
            history.push(
              `/add/file/${patientId}/${records[records.length - 1].id}`
            );
          }}
          onError={err => {
            setError('Please check your internet connection');
            setLoading(false);
          }}
        >
          {addPatientRecord => (
            <Button
              type="submit"
              variant="primary"
              style={{ opacity: loading ? 0.7 : 1 }}
              disabled={loading ? true : false}
              onClick={() => {
                setError();
                if (
                  patientId &&
                  patientCaseId &&
                  id &&
                  selectedHospitalId &&
                  eventType &&
                  observation &&
                  Tx &&
                  suggestions &&
                  cevsSp &&
                  cevsDp &&
                  cePr &&
                  ceRr &&
                  ceHeight &&
                  ceWeight &&
                  medication &&
                  advice &&
                  query &&
                  followUpObservation
                ) {
                  setLoading(true);
                  addPatientRecord();
                } else {
                  setError('All fields are required');
                  setLoading(false);
                }
              }}
            >
              {loading ? <Spinner /> : 'Add Record'}
            </Button>
          )}
        </Mutation>
      </Form>
    </>
  );
};

export default withRouter(withApollo(AddPatientRecord));
