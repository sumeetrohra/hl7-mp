import React from 'react';

import PatientCard from './PatientCard';

const PatientList = ({ patients, accessible }) => {
  return patients.map((patient, i) => (
    <PatientCard key={i} patient={patient} accessible={accessible} />
  ));
};

export default PatientList;
