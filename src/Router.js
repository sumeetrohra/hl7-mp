import React, { useContext, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import { AuthContext } from './AuthConfig';
import { MP, SET_MP } from './constants';

import Login from './pages/Login';
import Home from './pages/Home';
import SearchPatients from './pages/SearchPatients';
import AddNewPatient from './pages/AddNewPatient';
import AddPatientCase from './pages/AddPatientCase';
import AddPatientRecord from './pages/AddPatientRecord';
import PatientDetails from './pages/PatientDetails';
import AddPatientRecordFile from './pages/AddPatientRecordFile';

const Router = () => {
  const { authState, authDispatch } = useContext(AuthContext);

  const mp = localStorage.getItem(MP);

  useEffect(() => {
    if (mp) {
      authDispatch({
        type: SET_MP,
        payload: JSON.parse(mp),
      });
    }
  }, [authDispatch, mp]);

  return (
    <Switch>
      {authState && authState.token && authState.mp ? (
        <>
          <Route exact path="/" component={Home} />
          <Route exact path="/add/patient" component={AddNewPatient} />
          <Route exact path="/add/case/:patientId" component={AddPatientCase} />
          <Route
            exact
            path="/add/record/:patientId/:patientCaseId"
            component={AddPatientRecord}
          />
          <Route exact path="/search" component={SearchPatients} />
          <Route exact path="/patient/:patientId" component={PatientDetails} />
          <Route
            exact
            path="/add/file/:patientId/:patientRecordId"
            component={AddPatientRecordFile}
          />
          <Route path="*" render={() => <Redirect to="/" />} />
        </>
      ) : (
        <>
          <Route exact path="/login" component={Login} />
          <Route path="*" render={() => <Redirect to="/login" />} />
        </>
      )}
    </Switch>
  );
};

export default Router;
