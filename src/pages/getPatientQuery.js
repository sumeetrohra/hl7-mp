import gql from 'graphql-tag';

export const GET_PATIENT_QUERY = gql`
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
