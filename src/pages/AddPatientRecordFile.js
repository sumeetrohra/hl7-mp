/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/storage';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import { Form, Button } from 'react-bootstrap';

import Spinner from '../components/Spinner';

const AddPatientRecordFile = ({ match, client }) => {
  const { patientId, patientRecordId } = match.params;

  const [file, setFile] = useState();
  const [oldFiles, setOldFiles] = useState([]);
  const [fileName, setFileName] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    async function getPatientQuery() {
      setLoadingFiles(true);
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
      } catch (err) {
      } finally {
        setLoadingFiles(false);
      }
    }
    getPatientQuery();
  }, [oldFiles]);

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
    setError();
    setLoading(true);
    try {
      const fileNameSplit = file.name.split('.');
      const fileExt =
        fileNameSplit.length > 0
          ? fileNameSplit[fileNameSplit.length - 1]
          : null;
      const storageRef = firebase
        .storage()
        .ref()
        .child(`${patientId}_${patientRecordId}_${Date.now()}.${fileExt}`);
      const snapshot = await storageRef.put(file);
      const fileUrl = await snapshot.ref.getDownloadURL();
      const result = await client.mutate({
        mutation: ADD_FILE_MUTATION,
        variables: { patientId, patientRecordId, fileName, fileUrl },
        fetchPolicy: 'no-cache'
      });
      setOldFiles(result.data.addPatientRecordFile.files);
      setFileName('');
      setFile();
    } catch (err) {
      setError('Some error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!loadingFiles ? (
        oldFiles.length > 0 && (
          <>
            <h3>Files:</h3>
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
        )
      ) : (
        <>
          <p>Loading Files</p>
          <Spinner />
          <br />
        </>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form>
        <Form.Group>
          <Form.Label>File Name</Form.Label>
          <Form.Control
            type="text"
            value={fileName}
            onChange={e => {
              setError();
              setFileName(e.target.value);
            }}
            placeholder="file name"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="file"
            onChange={e => {
              setError();
              setFile(e.target.files[0]);
            }}
          />
        </Form.Group>
      </Form>

      {file && fileName && (
        <Button
          onClick={uploadFile}
          style={{ opacity: loading ? 0.7 : 1 }}
          disabled={loading ? true : false}
        >
          {loading ? <Spinner /> : 'Upload'}
        </Button>
      )}
    </>
  );
};

export default withApollo(AddPatientRecordFile);
