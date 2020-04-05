/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { withApollo, Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import { AuthContext } from '../AuthConfig';
import Spinner from '../components/Spinner';

export const GET_HOSPITALS_QUERY = gql`
  query getHospitals {
    getHospitals {
      id
      name
    }
  }
`;

const AddPatientCase = ({ match, client, history }) => {
  const { patientId } = match.params;
  const { authState } = useContext(AuthContext);

  const {
    mp: { id },
  } = authState;

  const [icdCodeQuery, setIcdCodeQuery] = useState('');
  const [icdCodes, setIcdCodes] = useState([]);
  const [icdSubCodes, setIcdSubCodes] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [selectedIcdCodeID, setSelectedIcdCodeID] = useState('');
  const [selectedIcdSubCodeID, setSelectedIcdSubCodeID] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [HPC, setHPC] = useState('');
  const [MoI, setMoI] = useState('');
  const [DnV, setDnV] = useState('');
  const [clinicNote, setClinicNote] = useState('');
  const [diagnosisType, setDiagnosisType] = useState('');
  const [currentClinicalStatus, setCurrentClinicalStatus] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [displayIcdCodes, setDisplayIcdCodes] = useState(false);

  const GET_ICD_CODES_QUERY = gql`
    query getIcdCodes($icdCode: String!) {
      getIcdCodes(icdCode: $icdCode) {
        id
        icdCode
        commonName
      }
    }
  `;

  const GET_ICD_SUB_CODES_QUERY = gql`
    query getIcdSubCodes($icdCodeId: String!) {
      getIcdSubCodes(icdCodeId: $icdCodeId) {
        id
        icdSubCode
        scientificName
        icdCode {
          id
        }
      }
    }
  `;

  const ADD_PATIENT_CASE_MUTATION = gql`
    mutation addPatientCase(
      $patientId: String!
      $mpId: String!
      $selectedIcdCodeID: String!
      $selectedIcdSubCodeID: String!
      $selectedHospitalId: String!
      $HPC: String!
      $MoI: String
      $DnV: String
      $clinicNote: String!
      $diagnosisType: String!
      $currentClinicalStatus: String!
    ) {
      addPatientCase(
        patientId: $patientId
        mpId: $mpId
        icdCodeId: $selectedIcdCodeID
        icdSubCodeId: $selectedIcdSubCodeID
        hospitalId: $selectedHospitalId
        HPC: $HPC
        MoI: $MoI
        DnV: $DnV
        clinicNote: $clinicNote
        diagnosisType: $diagnosisType
        currentClinicalStatus: $currentClinicalStatus
      ) {
        id
        patientCase {
          id
        }
      }
    }
  `;

  useEffect(() => {
    (async function () {
      if (!selectedIcdCodeID) return;
      const results = await client.query({
        query: GET_ICD_SUB_CODES_QUERY,
        variables: { icdCodeId: selectedIcdCodeID },
        fetchPolicy: 'network-only',
      });
      setIcdSubCodes(results.data.getIcdSubCodes);
    })();
  }, [selectedIcdCodeID]);

  useEffect(() => {
    (async function () {
      const results = await client.query({
        query: GET_HOSPITALS_QUERY,
        fetchPolicy: 'network-only',
      });
      setHospitals(results.data.getHospitals);
    })();
  }, []);

  const searchIcdCodes = async () => {
    if (!icdCodeQuery) return;
    const results = await client.query({
      query: GET_ICD_CODES_QUERY,
      variables: {
        icdCode: icdCodeQuery,
      },
      fetchPolicy: 'network-only',
    });
    setIcdCodes(results.data.getIcdCodes);
    setDisplayIcdCodes(true);
  };

  return (
    <>
      <h3>Add Case</h3>
      <Form.Group>
        <Form.Label>Enter ICD Code</Form.Label>
        <Form.Control
          type="text"
          required
          value={icdCodeQuery}
          onChange={(e) => setIcdCodeQuery(e.target.value)}
        />
        <Button onClick={searchIcdCodes}>Search</Button>
      </Form.Group>
      <Form onSubmit={(e) => e.preventDefault()}>
        {displayIcdCodes ? (
          icdCodes.length > 0 ? (
            <Form.Group>
              <Form.Label>ICD code</Form.Label>
              <Form.Control
                as="select"
                required
                onChange={(e) => setSelectedIcdCodeID(e.target.value)}
              >
                <option>Select one...</option>
                {icdCodes.map(({ icdCode, commonName, id }, i) => (
                  <option
                    key={i}
                    value={id}
                  >{`Code: ${icdCode}, Name: ${commonName}`}</option>
                ))}
              </Form.Control>
            </Form.Group>
          ) : (
            <>
              <p>Loading ICD Codes</p>
              <Spinner />
            </>
          )
        ) : null}
        {icdSubCodes.length > 0 && (
          <Form.Group>
            <Form.Label>ICD sub code</Form.Label>
            <Form.Control
              as="select"
              required
              onChange={(e) => setSelectedIcdSubCodeID(e.target.value)}
            >
              <option>Select one...</option>
              {icdSubCodes.map(({ id, icdSubCode, scientificName }, i) => (
                <option
                  key={i}
                  value={id}
                >{`Sub Code: ${icdSubCode}, Scientific name: ${scientificName}`}</option>
              ))}
            </Form.Control>
          </Form.Group>
        )}
        {hospitals.length > 0 ? (
          <Form.Group>
            <Form.Label>Hospital</Form.Label>
            <Form.Control
              as="select"
              required
              onChange={(e) => setSelectedHospitalId(e.target.value)}
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
            <p>Loading hospitals</p>
            <Spinner />
          </>
        )}
        <Form.Group>
          <Form.Label>HPC</Form.Label>
          <Form.Control
            type="text"
            required
            value={HPC}
            onChange={(e) => setHPC(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>MoI</Form.Label>
          <Form.Control
            type="text"
            value={MoI}
            onChange={(e) => setMoI(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>DnV</Form.Label>
          <Form.Control
            type="text"
            value={DnV}
            onChange={(e) => setDnV(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Clinic note</Form.Label>
          <Form.Control
            type="text"
            value={clinicNote}
            onChange={(e) => setClinicNote(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Diagnosis type</Form.Label>
          <Form.Control
            type="text"
            value={diagnosisType}
            onChange={(e) => setDiagnosisType(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Current clinical status</Form.Label>
          <Form.Control
            type="text"
            value={currentClinicalStatus}
            onChange={(e) => setCurrentClinicalStatus(e.target.value)}
            required
          />
        </Form.Group>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Mutation
          mutation={ADD_PATIENT_CASE_MUTATION}
          variables={{
            patientId,
            mpId: String(id),
            selectedIcdCodeID,
            selectedIcdSubCodeID,
            selectedHospitalId,
            HPC,
            MoI,
            DnV,
            clinicNote,
            diagnosisType,
            currentClinicalStatus,
          }}
          onCompleted={(res) => {
            setLoading(false);
            history.push(`/add/record/${patientId}/${res.addPatientCase.id}`);
          }}
          onError={(err) => {
            setError('Some error occurred');
            setLoading(false);
          }}
        >
          {(addPatientCase) => (
            <Button
              variant="primary"
              type="submit"
              style={{ opacity: loading ? 0.7 : 1 }}
              disabled={loading ? true : false}
              onClick={() => {
                setError();
                if (
                  patientId &&
                  id &&
                  selectedIcdCodeID &&
                  selectedIcdSubCodeID &&
                  selectedHospitalId &&
                  HPC &&
                  MoI &&
                  DnV &&
                  clinicNote &&
                  diagnosisType &&
                  currentClinicalStatus
                ) {
                  setLoading(true);
                  addPatientCase();
                } else {
                  setError('All fields are required');
                  setLoading(false);
                }
              }}
            >
              {loading ? <Spinner /> : 'Add Patient Case'}
            </Button>
          )}
        </Mutation>
      </Form>
    </>
  );
};

export default withRouter(withApollo(AddPatientCase));
