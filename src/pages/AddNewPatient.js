import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { withRouter } from 'react-router-dom';

import Spinner from '../components/Spinner';
import { validateEmail, validatePhoneNumber } from '../utils';

const AddNewPatient = ({ history }) => {
  const [fName, setFName] = useState('');
  const [lName, setLName] = useState('');
  const [midName, setMidName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [bg, setBg] = useState('');
  const [sex, setSex] = useState('');
  const [religion, setReligion] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [primaryLanguage, setPrimaryLanguage] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [address, setAddress] = useState('');
  const [countryCode, setCountryCode] = useState(null);
  const [occupation, setOccupation] = useState('');
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [socioEconomicStatus, setSocioEconomicStatus] = useState('');
  const [immunizationStatus, setImmunizationStatus] = useState('');
  const [allergyStatus, setAllergyStatus] = useState(null);
  const [organDonorStatus, setOrganDonorStatus] = useState(null);
  const [PMH, setPMH] = useState('');
  const [DHx, setDHx] = useState('');
  const [Ca, setCa] = useState('');
  const [IDDM, setIDDM] = useState('');
  const [NIDDM, setNIDDM] = useState('');
  const [MI, setMI] = useState('');
  const [AF, setAF] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const CREATE_PATIENT_MUTATION = gql`
    mutation addPatient(
      $lName: String!
      $fName: String!
      $midName: String!
      $motherName: String!
      $dob: DateTime!
      $bg: String!
      $sex: String!
      $religion: String!
      $maritalStatus: String!
      $primaryLanguage: String!
      $birthPlace: String!
      $address: String!
      $countryCode: Int!
      $occupation: String!
      $contact1: String!
      $contact2: String!
      $email: String!
      $password: String!
      $socioEconomicStatus: String!
      $immunizationStatus: String!
      $allergyStatus: Boolean!
      $organDonorStatus: Boolean!
      $PMH: String!
      $DHx: String!
      $Ca: String!
      $IDDM: String!
      $NIDDM: String!
      $MI: String!
      $AF: String!
    ) {
      addPatient(
        lastName: $lName
        firstName: $fName
        middleName: $midName
        motherName: $motherName
        dob: $dob
        bloodGroup: $bg
        sex: $sex
        religion: $religion
        maritalStatus: $maritalStatus
        primaryLanguage: $primaryLanguage
        birthPlace: $birthPlace
        address: $address
        countryCode: $countryCode
        occupation: $occupation
        contact1: $contact1
        contact2: $contact2
        email: $email
        password: $password
        socioEconomicStatus: $socioEconomicStatus
        immunizationStatus: $immunizationStatus
        allergyStatus: $allergyStatus
        organDonorStatus: $organDonorStatus
        PMH: $PMH
        DHx: $DHx
        Ca: $Ca
        IDDM: $IDDM
        NIDDM: $NIDDM
        MI: $MI
        AF: $AF
      ) {
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
      }
    }
  `;

  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      <Form.Group>
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={fName}
          onChange={(e) => setFName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Middle Name</Form.Label>
        <Form.Control
          type="text"
          value={midName}
          onChange={(e) => setMidName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={lName}
          onChange={(e) => setLName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Mother Name</Form.Label>
        <Form.Control
          type="text"
          value={motherName}
          onChange={(e) => setMotherName(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>DOB</Form.Label>
        <Form.Control
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Blood Group</Form.Label>
        <Form.Control
          as="select"
          value={bg}
          onChange={(e) => setBg(e.target.value)}
        >
          <option>Select one...</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
          <option>Other</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Sex</Form.Label>
        <Form.Control
          as="select"
          value={sex}
          onChange={(e) => setSex(e.target.value)}
        >
          <option>Select one...</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Religion</Form.Label>
        <Form.Control
          type="text"
          value={religion}
          onChange={(e) => setReligion(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Marital Status</Form.Label>
        <Form.Control
          as="select"
          value={maritalStatus}
          onChange={(e) => setMaritalStatus(e.target.value)}
        >
          <option>Select one...</option>
          <option>Married</option>
          <option>Single</option>
          <option>Divorced/Widowed</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Primary Language</Form.Label>
        <Form.Control
          type="text"
          value={primaryLanguage}
          onChange={(e) => setPrimaryLanguage(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Birth place</Form.Label>
        <Form.Control
          type="text"
          value={birthPlace}
          onChange={(e) => setBirthPlace(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Country code</Form.Label>
        <Form.Control
          type="number"
          value={countryCode}
          onChange={(e) => setCountryCode(Number(e.target.value))}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Occupation</Form.Label>
        <Form.Control
          type="text"
          value={occupation}
          onChange={(e) => setOccupation(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Contact 1</Form.Label>
        <Form.Control
          type="text"
          value={contact1}
          onChange={(e) => setContact1(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Contact 2</Form.Label>
        <Form.Control
          type="text"
          value={contact2}
          onChange={(e) => setContact2(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Socio-econonic status</Form.Label>
        <Form.Control
          type="text"
          value={socioEconomicStatus}
          onChange={(e) => setSocioEconomicStatus(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Immunization Status</Form.Label>
        <Form.Control
          type="text"
          value={immunizationStatus}
          onChange={(e) => setImmunizationStatus(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Allergy status</Form.Label>
        <Form.Control
          as="select"
          value={allergyStatus}
          onChange={(e) => setAllergyStatus(Boolean(e.target.value))}
        >
          <option>Select one...</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="exampleForm.ControlSelect1">
        <Form.Label>Organ donor status</Form.Label>
        <Form.Control
          as="select"
          value={organDonorStatus}
          onChange={(e) => setOrganDonorStatus(Boolean(e.target.value))}
        >
          <option>Select one...</option>
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>PMH</Form.Label>
        <Form.Control
          type="text"
          value={PMH}
          onChange={(e) => setPMH(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>DHx</Form.Label>
        <Form.Control
          type="text"
          value={DHx}
          onChange={(e) => setDHx(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Ca</Form.Label>
        <Form.Control
          type="text"
          value={Ca}
          onChange={(e) => setCa(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>IDDM</Form.Label>
        <Form.Control
          type="text"
          value={IDDM}
          onChange={(e) => setIDDM(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>NIDDM</Form.Label>
        <Form.Control
          type="text"
          value={NIDDM}
          onChange={(e) => setNIDDM(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>MI</Form.Label>
        <Form.Control
          type="text"
          value={MI}
          onChange={(e) => setMI(e.target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>AF</Form.Label>
        <Form.Control
          type="text"
          value={AF}
          onChange={(e) => setAF(e.target.value)}
        />
      </Form.Group>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Mutation
        mutation={CREATE_PATIENT_MUTATION}
        variables={{
          lName,
          fName,
          midName,
          motherName,
          dob,
          bg,
          sex,
          religion,
          maritalStatus,
          primaryLanguage,
          birthPlace,
          address,
          countryCode,
          occupation,
          contact1,
          contact2,
          email,
          password,
          socioEconomicStatus,
          immunizationStatus,
          allergyStatus,
          organDonorStatus,
          PMH,
          DHx,
          Ca,
          IDDM,
          NIDDM,
          MI,
          AF,
        }}
        onCompleted={(res) => {
          setLoading(false);
          localStorage.setItem('newPat', JSON.stringify(res));
          history.push(`/add/case/${res.addPatient.id}`);
        }}
        onError={(err) => {
          setError('Some error occurred');
          setLoading(false);
        }}
      >
        {(addPatient) => (
          <Button
            variant="primary"
            type="submit"
            style={{ opacity: loading ? 0.7 : 1 }}
            disabled={loading ? true : false}
            onClick={() => {
              setError();
              if (
                lName &&
                fName &&
                midName &&
                motherName &&
                dob &&
                bg &&
                sex &&
                religion &&
                maritalStatus &&
                primaryLanguage &&
                birthPlace &&
                address &&
                countryCode &&
                occupation &&
                validatePhoneNumber(contact1) &&
                validatePhoneNumber(contact2) &&
                validateEmail(email) &&
                password &&
                socioEconomicStatus &&
                immunizationStatus &&
                allergyStatus &&
                organDonorStatus &&
                PMH &&
                DHx &&
                Ca &&
                IDDM &&
                NIDDM &&
                MI &&
                AF
              ) {
                setLoading(true);
                addPatient();
              } else if (!validateEmail(email)) {
                setError('Please enter valid email address');
                setLoading(false);
              } else if (
                !validatePhoneNumber(contact1) ||
                !validatePhoneNumber(contact2)
              ) {
                setError('Please enter valid phone number');
                setLoading(false);
              } else {
                setError('All fields are required');
                setLoading(false);
              }
            }}
          >
            {loading ? <Spinner /> : 'Add Patient'}
          </Button>
        )}
      </Mutation>
    </Form>
  );
};

export default withRouter(AddNewPatient);
