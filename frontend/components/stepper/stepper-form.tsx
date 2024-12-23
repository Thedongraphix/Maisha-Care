import React, { useState } from 'react';
import { Steps, Button, Row, Col } from 'antd';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import TextInput from '../inputs/TextInput';
import MedicalRecordWrapper from '../wrapper/medical-wrapper';
import { useAccount } from 'wagmi';

const { Step } = Steps;

// Custom components for complex inputs
const VitalSigns = ({ prefix }: { prefix: string }) => (
  <div>
    <h4>Vital Signs</h4>
    <Row gutter={16}>
      <Col span={12}>
        <TextInput label="Blood Pressure (systolic)" name={`${prefix}.bloodPressureSystolic`} type="number" />
      </Col>
      <Col span={12}>
        <TextInput label="Blood Pressure (diastolic)" name={`${prefix}.bloodPressureDiastolic`} type="number" />
      </Col>
    </Row>
    <TextInput label="Heart Rate" name={`${prefix}.heartRate`} type="number" />
    <TextInput label="Respiratory Rate" name={`${prefix}.respiratoryRate`} type="number" />
    <TextInput label="Body Temperature" name={`${prefix}.bodyTemperature`} type="number" />
    <TextInput label="Oxygen Saturation (SpO2)" name={`${prefix}.oxygenSaturation`} type="number" />
  </div>
);

const BodyMeasurements = ({ prefix }: { prefix: string }) => (
  <div>
    <h4>Body Measurements</h4>
    <TextInput label="Height (cm)" name={`${prefix}.height`} type="number" />
    <TextInput label="Weight (kg)" name={`${prefix}.weight`} type="number" />
  </div>
);

const StepperForm: React.FC = () => {
  const { address, isConnected } = useAccount();
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: 'Current Health',
      fields: ['currentHealth'],
    },
    {
      title: 'Medical History',
      fields: ['medicalHistory'],
    },
    {
      title: 'Treatment Records',
      fields: ['treatmentRecords'],
    },
  ];

  const initialValues = {
    patientAddress: "", // Initialize this with the patient's address
    currentHealth: {
      vitalSigns: {
        bloodPressureSystolic: "",
        bloodPressureDiastolic: "",
        heartRate: "",
        respiratoryRate: "",
        bodyTemperature: "",
        oxygenSaturation: "",
      },
      bodyMeasurements: { height: "", weight: "" },
      generalHealth: {
        generalAppearance: "",
        levelOfConsciousness: "",
        painScore: "",
      },
      currentSymptoms: {
        primaryComplaint: "",
        durationOfSymptoms: "",
        severityOfSymptoms: "",
      },
      currentMedications: [], // Initialize as an empty array
      allergies: [], // Initialize as an empty array
      lifestyleFactors: {
        smokingStatus: "",
        alcoholConsumption: "",
        exerciseHabits: "",
        dietOverview: "",
      },
    },
    medicalHistory: {
      pastMedicalConditions: [], // Initialize as an empty array
      surgicalHistory: [], // Initialize as an empty array
      familyMedicalHistory: [], // Initialize as an empty array
      immunizationRecords: [], // Initialize as an empty array
      majorInjuries: [], // Initialize as an empty array
      chronicMedications: [], // Initialize as an empty array
      pastHospitalizations: [], // Initialize as an empty array
      mentalHealthHistory: {
        diagnosedConditions: "",
        treatmentsReceived: "",
      },
      reproductiveHistory: {
        pregnancies: "",
        childbirthDetails: "",
      },
    },
    treatmentRecords: {
      visitInformation: {
        dateOfVisit: "",
        reasonForVisit: "",
        treatingPhysician: "",
      },
      diagnosis: {
        primaryDiagnosis: "",
        secondaryDiagnoses: "",
        icdCodes: "",
      },
      treatmentPlan: {
        prescribedMedications: [], // Initialize as an empty array
        nonPharmacologicalInterventions: "",
      },
      proceduresPerformed: [], // Initialize as an empty array
      laboratoryTests: [], // Initialize as an empty array
      imagingStudies: [], // Initialize as an empty array
      referrals: [], // Initialize as an empty array
      followUpInstructions: {
        nextAppointmentDate: "",
        specificInstructions: "",
      },
      progressNotes: ""}
  };

  const validationSchema = Yup.object({
    currentHealth: Yup.object({
      vitalSigns: Yup.object({
        bloodPressureSystolic: Yup.number().required('Required'),
        bloodPressureDiastolic: Yup.number().required('Required'),
        heartRate: Yup.number().required('Required'),
        respiratoryRate: Yup.number().required('Required'),
        bodyTemperature: Yup.number().required('Required'),
        oxygenSaturation: Yup.number().required('Required'),
      }),
      bodyMeasurements: Yup.object({
        height: Yup.number().required('Required'),
        weight: Yup.number().required('Required'),
      }),
      // Add more validation as needed
    }),
    // Add validation for medicalHistory and treatmentRecords
  });

  const handleSubmit = (values: any) => {
    console.log('Form submitted with values:', values);
    // Here you can submit the form data to your backend
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <Steps current={current}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {({ errors, touched, isValid, values }) => (
          <Form className="mt-8">
            {current === 0 && (
              <div>
                <h3>Patient Address</h3>
                <TextInput label="Patient Address" name="patientAddress" type="text" />
                <h3>Current Health</h3>
                <VitalSigns prefix="currentHealth.vitalSigns" />
                <BodyMeasurements prefix="currentHealth.bodyMeasurements" />
                <TextInput label="General Appearance" name="currentHealth.generalHealth.generalAppearance" type="text" />
                <TextInput label="Level of Consciousness" name="currentHealth.generalHealth.levelOfConsciousness" type="text" />
                <TextInput label="Pain Score (0-10)" name="currentHealth.generalHealth.painScore" type="number" />
                {/* Add more fields for current health */}
                <h4>Current Medications</h4>
                <FieldArray name="currentHealth.currentMedications">
                  {(arrayHelpers) => (
                    <div>
                      {values.currentHealth.currentMedications.map((medication, index) => (
                        <div key={index}>
                          <TextInput label="Medication Name" name={`currentHealth.currentMedications.${index}.name`} type="text" />
                          <TextInput label="Dosage" name={`currentHealth.currentMedications.${index}.dosage`} type="text" />
                          <TextInput label="Frequency" name={`currentHealth.currentMedications.${index}.frequency`} type="text" />
                          <Button onClick={() => arrayHelpers.remove(index)}>Remove</Button>
                        </div>
                      ))}
                      <Button onClick={() => arrayHelpers.push({ name: '', dosage: '', frequency: '' })}>Add Medication</Button>
                    </div>
                  )}
                </FieldArray>
                {/* Add more sections for current health */}
              </div>
            )}

            {current === 1 && (
              <div>
                <h3>Medical History</h3>
                {/* Add fields for medical history */}
                <h4>Past Medical Conditions</h4>
                <FieldArray name="medicalHistory.pastMedicalConditions">
                  {(arrayHelpers) => (
                    <div>
                      {values.medicalHistory.pastMedicalConditions.map((condition, index) => (
                        <div key={index}>
                          <TextInput label="Condition" name={`medicalHistory.pastMedicalConditions.${index}.condition`} type="text" />
                          <TextInput label="Year Diagnosed" name={`medicalHistory.pastMedicalConditions.${index}.yearDiagnosed`} type="number" />
                          <TextInput label="Current Status" name={`medicalHistory.pastMedicalConditions.${index}.currentStatus`} type="text" />
                          <Button onClick={() => arrayHelpers.remove(index)}>Remove</Button>
                        </div>
                      ))}
                      <Button onClick={() => arrayHelpers.push({ condition: '', yearDiagnosed: '', currentStatus: '' })}>Add Condition</Button>
                    </div>
                  )}
                </FieldArray>
                {/* Add more sections for medical history */}
              </div>
            )}

            {current === 2 && (
              <div>
                <h3>Treatment Records</h3>
                {/* Add fields for treatment records */}
                <TextInput label="Date of Visit" name="treatmentRecords.visitInformation.dateOfVisit" type="date" />
                <TextInput label="Reason for Visit" name="treatmentRecords.visitInformation.reasonForVisit" type="text" />
                <TextInput label="Treating Physician" name="treatmentRecords.visitInformation.treatingPhysician" type="text" />
                {/* Add more sections for treatment records */}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              {current > 0 && (
                <Button type="default" onClick={() => setCurrent(current - 1)}>
                  Previous
                </Button>
              )}
              {current < steps.length - 1 && (
                <Button
                  type="primary"
                  className="text-black border border-black"
                  onClick={() => {
                    // You may want to add validation here before moving to the next step
                    setCurrent(current + 1);
                  }}
                >
                  Next
                </Button>
              )}
              {isConnected && address && current === steps.length - 1 ? (
                <MedicalRecordWrapper
                doctorAddress={address}
                patientAddress={values.patientAddress as `0x${string}`}
                formData={values}
              />
              ) : (
                <p className="text-red-500 mt-2">Please connect your wallet to continue</p>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepperForm;