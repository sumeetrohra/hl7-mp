import React, { useState, useEffect } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import saveAs from 'save-as';

const PatientDetails = ({ match, client, history }) => {
  const { patientId } = match.params;

  const [patientDetails, setPatientDetails] = useState(null);
  const [textDetails, setTextDetails] = useState('');

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

  const GET_PATIENT_QUERY = gql`
    query getPatient($patientId: String!) {
      getPatient(patientId: $patientId) {
        id
        lastName
        firstName
        middleName
        motherName
        dob
        bloodGroup
        sex
        religion
        maritalStatus
        primaryLanguage
        birthPlace
        address
        countryCode
        occupation
        contact1
        contact2
        email
        socioEconomicStatus
        immunizationStatus
        allergyStatus
        organDonorStatus
        PMH
        DHx
        Ca
        IDDM
        NIDDM
        MI
        AF
        registeredAt
        careProvider {
          firstName
          lastName
          middleName
          address
          cityId
          pinCode
          countryCode
          contact1
          email
        }
        insurance {
          id
          status
          companyName
        }
        patientCase {
          id
          mp {
            id
            mpId
            lastName
            firstName
            middleName
            email
          }
          icdCode {
            id
            icdCode
            commonName
          }
          icdSubCode {
            id
            icdSubCode
            scientificName
          }
          hospital {
            id
            name
          }
          HPC
          MoI
          DnV
          clinicNote
          diagnosisType
          currentClinicalStatus
          createdAt
          records {
            id
            visitNo
            eventType
            encounterDate
            mp {
              id
              mpId
              lastName
              firstName
              middleName
              email
            }
            hospital {
              id
              name
            }
            observation
            Tx
            suggesstions
            cevsSp
            cevsDp
            cePr
            ceRr
            ceHeight
            ceWeight
            medication
            advice
            query
            followUpObservation
            files {
              id
              name
              url
            }
          }
        }
      }
    }
  `;

  const records =
    patientDetails && patientDetails.patientCase
      ? patientDetails.patientCase.records
      : null;

  return (
    <>
      <div id="hl7-data">
        <h3>Patient Details</h3>

        {patientDetails && (
          <>
            <MSHMessage
              version="2.5"
              countryCode={patientDetails.countryCode}
              language="English"
            />
            <PIDMessage patientDetails={patientDetails} />
          </>
        )}
        {patientDetails &&
          patientDetails.patientCase &&
          records.length > 0 &&
          records.map((record, index) => (
            <EVNMessage key={index} record={record} />
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
        </>
      )}
    </>
  );
};

export default withRouter(withApollo(PatientDetails));

// message header
const MSHMessage = ({ version, countryCode, language }) => {
  return (
    <p>{`MSH | ^ ~ \\ & | | | | | ${Date.now()} | | | | | ${version} | | | | | ${countryCode} | | ${language}`}</p>
  );
};

// patient details
const PIDMessage = ({ patientDetails }) => {
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
    <p>{`PID | ${id} | | | | ${lastName}^${firstName}^${middleName} | ${motherName} | ${dob} | ${sex} | | | ${address} | ${countryCode} | ${contact1} | ${contact2} | ${primaryLanguage} | ${maritalStatus} | ${religion} | | | | | ${birthPlace} | |  | ${countryCode} | | ${countryCode}`}</p>
  );
};

// care provider
const NK1Message = ({ careProvider }) => {
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
    <p>{`NK1 | ${lastName}^${firstName}^${middleName} | | ${address} | ${contact1} | ${email} | | | | | | | | | | | | | ${countryCode} | | | | | | | | ${countryCode} | | | | | | | | | | `}</p>
  );
};

// patient case
const DG1Message = ({ patientCase }) => {
  const {
    id,
    icdCode: { icdCode },
    icdSubCode: { icdSubCode },
    mp
  } = patientCase;
  return (
    <p>{`DG1 | ${id} | ICD | ${icdCode} - ${icdSubCode} | | | | | | | | | | | | | ${mp.id}`}</p>
  );
};

// records
// TODO: <p>EVN</p> missing
const EVNMessage = ({ record }) => {
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
    files
  } = record;
  return (
    <>
      <p>{`EVN | ADT | ${Date.now()} | | | | ${eventType}`}</p>
      <p>{`OBX | ${id} | | 1 | | ${cevsSp} | mm of Hg | | | | | | | | '${encounterDate}' UTC`}</p>
      <p>{`OBX | ${id} | | 1 | | ${cevsDp} | mm of Hg | | | | | | | | '${encounterDate}' UTC`}</p>
      <p>{`OBX | ${id} | | 1 | | ${cePr} | beats per minute | | | | | | | | '${encounterDate}' UTC`}</p>
      <p>{`OBX | ${id} | | 1 | | ${ceRr} | breaths per minute | | | | | | | | '${encounterDate}' UTC`}</p>
      <p>{`OBX | ${id} | | 1 | | ${ceHeight} | cm | | | | | | | | '${encounterDate}' UTC`}</p>
      <p>{`OBX | ${id} | | 1 | | ${ceWeight} | kg | | | | | | | | '${encounterDate}' UTC`}</p>
      <ul>
        {files.map(file => (
          <li>
            {file.name}:{' '}
            <a href={file.url} target="_blank" rel="noopener noreferrer">
              {file.url}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
};
