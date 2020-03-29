import React, { useState, useEffect } from 'react';
import { withApollo } from 'react-apollo';
import { Button, Form } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import saveAs from 'save-as';
import firebase from 'firebase/app';
import 'firebase/storage';

import { validateEmail } from '../utils';
import { GET_PATIENT_QUERY } from './getPatientQuery';
import Spinner from '../components/Spinner';

const PatientDetails = ({ match, client, history }) => {
  const { patientId } = match.params;

  const [patientDetails, setPatientDetails] = useState(null);
  const [textDetails, setTextDetails] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    async function getPatientQuery() {
      const result = await client.query({
        query: GET_PATIENT_QUERY,
        variables: { patientId },
        fetchPolicy: 'network-only'
      });
      setPatientDetails(result.data.getPatient);
    }
    getPatientQuery();
  });

  useEffect(() => {
    if (patientDetails) {
      const detailsDiv = document.querySelector('#hl7-data');
      setTextDetails(detailsDiv.innerText);
    }
  }, [patientDetails]);

  const handleDownload = () => {
    if (textDetails) {
      var blob = new Blob([textDetails], {
        type: 'text/plain;charset=utf-8'
      });
      saveAs(
        blob,
        `${patientDetails.firstName}_${patientDetails.lastName}.txt`
      );
    }
  };

  const records =
    patientDetails && patientDetails.patientCase
      ? patientDetails.patientCase.records
      : null;

  const handleEmailShare = async () => {
    if (textDetails) {
      var blob = new Blob([textDetails], {
        type: 'text/plain;charset=utf-8'
      });
      const storageRef = firebase
        .storage()
        .ref()
        .child(`${patientId}_${Date.now()}`);
      const snapshot = await storageRef.put(blob);
      const fileUrl = await snapshot.ref.getDownloadURL();
      console.log(fileUrl);
      const { firstName, lastName } = patientDetails;
      window.open(
        `mailto:${email}?subject=HL7 reports for ${firstName} ${lastName}&body=HL7 file can be found at this url: ${fileUrl}`
      );
    }
  };

  return (
    <>
      <div id="hl7-data">
        {patientDetails ? (
          <h3>Patient Details</h3>
        ) : (
          <>
            <p>Loading Patient Details...</p>
            <Spinner />
          </>
        )}

        {patientDetails && (
          <>
            <MSHMessage
              version="2.5"
              countryCode={patientDetails.countryCode}
              language="English"
              date={patientDetails.registeredAt}
            />
            <PIDMessage patientDetails={patientDetails} />
          </>
        )}
        {patientDetails &&
          patientDetails.patientCase &&
          records.length > 0 &&
          records.map((record, index) => (
            <EVNMessage
              key={index}
              record={record}
              patientId={patientDetails.id}
              history={history}
            />
          ))}
        {patientDetails && patientDetails.careProvider ? (
          <NK1Message careProvider={patientDetails.careProvider} />
        ) : null}
        {patientDetails && patientDetails.patientCase && (
          <DG1Message patientCase={patientDetails.patientCase} />
        )}
      </div>
      {patientDetails && !patientDetails.patientCase ? (
        <>
          <Button
            type="button"
            variant="primary"
            onClick={() => history.push(`/add/case/${patientDetails.id}`)}
          >
            Add Patient Case
          </Button>
        </>
      ) : (
        patientDetails && (
          <Button
            type="button"
            variant="primary"
            onClick={() =>
              history.push(
                `/add/record/${patientDetails.id}/${patientDetails.patientCase.id}`
              )
            }
          >
            Add Patient Record
          </Button>
        )
      )}
      {'  '}
      {patientDetails && (
        <>
          <Button onClick={handleDownload}>Download</Button>
          {'  '}
          <Form onSubmit={e => e.preventDefault()}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
          <Button
            onClick={handleEmailShare}
            style={{ opacity: validateEmail(email) ? 1 : 0.7 }}
            disabled={validateEmail(email) ? false : true}
          >
            Share with Email
          </Button>
        </>
      )}
    </>
  );
};

export default withRouter(withApollo(PatientDetails));

const EntityDiv = ({ children, onClick }) => {
  return (
    <div
      style={{
        border: '1px solid black',
        borderRadius: '5px',
        margin: '5px',
        padding: '5px',
        cursor: onClick ? 'pointer' : 'null'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// message header
const MSHMessage = ({ version, countryCode, language, date }) => {
  return (
    <EntityDiv>
      <p>{`MSH | ^ ~ \\ & | | | | | ${Date.parse(
        date
      )} | | | | | ${version} | | | | | ${countryCode} | | ${language}`}</p>
    </EntityDiv>
  );
};

const getFlatObject = (object, inputKey) => {
  if (object[inputKey]) {
    const careProviderDetails = Object.keys(object[inputKey]).reduce(
      (acc, key) => {
        acc = { ...acc, [`${inputKey}_${key}`]: object[inputKey][key] };
        return acc;
      },
      {}
    );
    return careProviderDetails;
  }
};

const GetEntityDetails = object => {
  object = {
    ...object,
    ...getFlatObject(object, 'careProvider'),
    ...getFlatObject(object, 'insurance')
  };
  return Object.keys(object)
    .filter(key => !key.match('_typename'))
    .filter(
      key =>
        object[key] === null || (object[key] && typeof object[key] !== 'object')
    )
    .map((key, i) => <li key={i}>{`${key}: ${object[key] || 'N/A'}`}</li>);
};

// patient details
const PIDMessage = ({ patientDetails }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    id,
    lastName,
    firstName,
    middleName,
    motherName,
    dob,
    sex,
    address,
    countryCode,
    contact1,
    contact2,
    primaryLanguage,
    maritalStatus,
    religion,
    birthPlace
  } = patientDetails;
  return (
    <>
      <EntityDiv onClick={() => setShowDetails(!showDetails)}>
        <p>{`PID | ${id} | | | | ${lastName}^${firstName}^${middleName} | ${motherName} | ${dob} | ${sex} | | | ${address} | ${countryCode} | ${contact1} | ${contact2} | ${primaryLanguage} | ${maritalStatus} | ${religion} | | | | | ${birthPlace} | |  | ${countryCode} | | ${countryCode}`}</p>
      </EntityDiv>
      <ul style={{ display: showDetails ? 'inherit' : 'none' }}>
        {GetEntityDetails({ ...patientDetails })}
      </ul>
    </>
  );
};

// care provider
const NK1Message = ({ careProvider }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    firstName,
    lastName,
    middleName,
    address,
    contact1,
    email,
    countryCode
  } = careProvider;
  return (
    <>
      <EntityDiv onClick={() => setShowDetails(!showDetails)}>
        <p>{`NK1 | ${lastName}^${firstName}^${middleName} | | ${address} | ${contact1} | ${email} | | | | | | | | | | | | | ${countryCode} | | | | | | | | ${countryCode} | | | | | | | | | | `}</p>
      </EntityDiv>
      <ul style={{ display: showDetails ? 'inherit' : 'none' }}>
        {GetEntityDetails(careProvider)}
      </ul>
    </>
  );
};

// patient case
const DG1Message = ({ patientCase }) => {
  const [showDetails, setShowDetails] = useState(false);
  console.log(patientCase);

  const {
    id,
    icdCode: { icdCode },
    icdSubCode: { icdSubCode, scientificName },
    mp,
    hospital
  } = patientCase;
  return (
    <>
      <EntityDiv onClick={() => setShowDetails(!showDetails)}>
        <p>{`DG1 | ${id} | ICD | ${icdCode} - ${icdSubCode} | | | | | | | | | | | | | ${mp.id}`}</p>
      </EntityDiv>
      <ul style={{ display: showDetails ? 'inherit' : 'none' }}>
        {GetEntityDetails({
          ...patientCase,
          icdCode: icdCode.icdCode,
          icdSubCode: icdSubCode.icdSubCode,
          scientificName,
          mp: mp.mpId,
          hospital: hospital.id
        })}
      </ul>
    </>
  );
};

// records
const EVNMessage = ({ record, patientId, history }) => {
  const [showDetails, setShowDetails] = useState(false);

  const {
    id,
    eventType,
    encounterDate,
    cevsSp,
    cevsDp,
    cePr,
    ceRr,
    ceHeight,
    ceWeight,
    files,
    mp,
    hospital
  } = record;
  return (
    <>
      <EntityDiv onClick={() => setShowDetails(!showDetails)}>
        <p>{`EVN | ADT | ${Date.parse(encounterDate)} | | | | ${eventType}`}</p>
        <p>{`OBX | ${id} | | 1 | | ${cevsSp} | mm of Hg | | | | | | | | '${encounterDate}' UTC`}</p>
        <p>{`OBX | ${id} | | 1 | | ${cevsDp} | mm of Hg | | | | | | | | '${encounterDate}' UTC`}</p>
        <p>{`OBX | ${id} | | 1 | | ${cePr} | beats per minute | | | | | | | | '${encounterDate}' UTC`}</p>
        <p>{`OBX | ${id} | | 1 | | ${ceRr} | breaths per minute | | | | | | | | '${encounterDate}' UTC`}</p>
        <p>{`OBX | ${id} | | 1 | | ${ceHeight} | cm | | | | | | | | '${encounterDate}' UTC`}</p>
        <p>{`OBX | ${id} | | 1 | | ${ceWeight} | kg | | | | | | | | '${encounterDate}' UTC`}</p>
      </EntityDiv>
      <ul style={{ display: showDetails ? 'inherit' : 'none' }}>
        {GetEntityDetails({ ...record, mp: mp.mpId, hospital: hospital.id })}
        {files.length > 0 && (
          <>
            <li>Files:</li>
            <ul>
              {files.map(file => (
                <li key={file.id}>
                  {file.name}:{' '}
                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                    {file.url}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </ul>
      <Button
        style={{ display: showDetails ? 'inherit' : 'none' }}
        onClick={() => history.push(`/add/file/${patientId}/${id}`)}
      >
        Add File
      </Button>
    </>
  );
};
