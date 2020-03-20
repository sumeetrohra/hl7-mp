import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Button } from 'react-bootstrap';

const AddPatientRecordFile = ({ match, client }) => {
  const { patientId, patientRecordId } = match.params;

  const [file, setFile] = useState();
  const [oldFiles, setOldFiles] = useState([]);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    async function getPatientQuery() {
      try {
        const result = await client.query({
          query: GET_PATIENT_RECORD_FILES_QUERY,
          variables: { patientId },
          fetchPolicy: 'network-only'
        });
        const patient = result.data.getPatient;
        const records =
          patient && patient.patientCase
            ? patient.patientCase.records.filter(
                record => record.id === patientRecordId
              )[0]
            : null;
        const files = records ? records.files : null;
        if (files.length > 0) {
          setOldFiles(files);
        }
      } catch (err) {}
    }
    getPatientQuery();
  });

  const GET_PATIENT_RECORD_FILES_QUERY = gql`
    query getPatient($patientId: String!) {
      getPatient(patientId: $patientId) {
        id
        patientCase {
          id
          records {
            id
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

  const ADD_FILE_MUTATION = gql`
    mutation addPatientRecordFile(
      $patientId: String!
      $patientRecordId: String!
      $fileName: String!
      $fileUrl: String!
    ) {
      addPatientRecordFile(
        patientId: $patientId
        patientRecordId: $patientRecordId
        fileName: $fileName
        fileUrl: $fileUrl
      ) {
        id
        files {
          id
          name
          url
        }
      }
    }
  `;

  const uploadFile = async () => {
    const storageRef = firebase
      .storage()
      .ref()
      .child(`${patientId}_${patientRecordId}_${Date.now()}`);
    const snapshot = await storageRef.put(file);
    const fileUrl = await snapshot.ref.getDownloadURL();
    const result = await client.mutate({
      mutation: ADD_FILE_MUTATION,
      variables: { patientId, patientRecordId, fileName, fileUrl },
      fetchPolicy: 'no-cache'
    });
    console.log(result);
    setOldFiles(result.data.addPatientRecordFile.files);
    setFileName('');
    setFile();
  };
  console.log(file);

  return (
    <>
      {oldFiles.length > 0 && (
        <>
          <p>Files:</p>
          <ul>
            {oldFiles.map(file => (
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
      <input
        type="text"
        value={fileName}
        onChange={e => setFileName(e.target.value)}
        placeholder="file name"
      />
      <input
        type="file"
        onChange={e => {
          setFile(e.target.files[0]);
        }}
      />
      {file && fileName && <Button onClick={uploadFile}>Upload</Button>}
    </>
  );
};

export default withApollo(AddPatientRecordFile);
