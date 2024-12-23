import * as Yup from 'yup';

export const MarketplaceSchema = Yup.object({
  patientName: Yup.string()
    .required("Patient's Name is Required")
    .min(2, "Name must be at least 2 characters"),
  
  bidAmount: Yup.number()
    .required("Bid Amount is Required")
    .positive("Bid amount must be positive")
    .min(1, "Minimum bid amount is 1"),

  currentHealth: Yup.object({
    vitalSigns: Yup.object({
      bloodPressureSystolic: Yup.string().required("Systolic Blood Pressure is required"),
      bloodPressureDiastolic: Yup.string().required("Diastolic Blood Pressure is required"),
      heartRate: Yup.string().required("Heart Rate is required"),
      respiratoryRate: Yup.string().required("Respiratory Rate is required"),
      bodyTemperature: Yup.string().required("Body Temperature is required"),
      oxygenSaturation: Yup.string().required("Oxygen Saturation is required"),
    }),

    bodyMeasurements: Yup.object({
      height: Yup.string().required("Height is required"),
      weight: Yup.string().required("Weight is required"),
    }),

    generalHealth: Yup.object({
      generalAppearance: Yup.string().required("General Appearance is required"),
      levelOfConsciousness: Yup.string().required("Level of Consciousness is required"),
      painScore: Yup.string().required("Pain Score is required"),
    }),

    currentSymptoms: Yup.object({
      primaryComplaint: Yup.string().required("Primary Complaint is required"),
      durationOfSymptoms: Yup.string().required("Duration of Symptoms is required"),
      severityOfSymptoms: Yup.string().required("Severity of Symptoms is required"),
    }),

    currentMedications: Yup.object({
      name: Yup.string().required("Medication Name is required"),
      dosage: Yup.string().required("Medication Dosage is required"),
      frequency: Yup.string().required("Medication Frequency is required"),
    }),

    allergies: Yup.object({
      allergy: Yup.string().required("Allergy information is required"),
      severity: Yup.string().required("Allergy Severity is required"),
    }),

    lifestyleFactors: Yup.object({
      smokingStatus: Yup.string().required("Smoking Status is required"),
      alcoholConsumption: Yup.string().required("Alcohol Consumption is required"),
      exerciseHabits: Yup.string().required("Exercise Habits is required"),
      dietOverview: Yup.string().required("Diet Overview is required"),
    }),
  }),

  medicalHistory: Yup.object({
    pastMedicalConditions: Yup.object({
      condition: Yup.string().required("Medical Condition is required"),
      yearDiagnosed: Yup.string().required("Year Diagnosed is required"),
      currentStatus: Yup.string().required("Current Status is required"),
    }),

    surgicalHistory: Yup.object({
      surgery: Yup.string().required("Surgery information is required"),
      date: Yup.string().required("Surgery Date is required"),
      complications: Yup.string().required("Complications information is required"),
    }),

    familyMedicalHistory: Yup.object({
      condition: Yup.string().required("Family Medical Condition is required"),
      relationship: Yup.string().required("Relationship information is required"),
    }),

    immunizationRecords: Yup.object({
      vaccination: Yup.string().required("Vaccination information is required"),
      dateAdministered: Yup.string().required("Vaccination Date is required"),
    }),

    majorInjuries: Yup.object({
      description: Yup.string().required("Injury Description is required"),
      dateOccurred: Yup.string().required("Injury Date is required"),
      treatmentReceived: Yup.string().required("Treatment information is required"),
    }),

    chronicMedications: Yup.object({
      medication: Yup.string().required("Chronic Medication is required"),
      durationOfUse: Yup.string().required("Duration of Use is required"),
    }),

    pastHospitalizations: Yup.object({
      reason: Yup.string().required("Hospitalization Reason is required"),
      dateAndDuration: Yup.string().required("Hospitalization Date and Duration is required"),
    }),

    mentalHealthHistory: Yup.object({
      diagnosedConditions: Yup.string().required("Diagnosed Conditions is required"),
      treatmentsReceived: Yup.string().required("Treatments Received is required"),
    }),

    reproductiveHistory: Yup.object({
      pregnancies: Yup.string().required("Pregnancy information is required"),
      childbirthDetails: Yup.string().required("Childbirth Details is required"),
    }),
  }),

  treatmentRecords: Yup.object({
    visitInformation: Yup.object({
      dateOfVisit: Yup.string().required("Visit Date is required"),
      reasonForVisit: Yup.string().required("Visit Reason is required"),
      treatingPhysician: Yup.string().required("Treating Physician is required"),
    }),

    diagnosis: Yup.object({
      primaryDiagnosis: Yup.string().required("Primary Diagnosis is required"),
      secondaryDiagnoses: Yup.string().required("Secondary Diagnoses is required"),
      icdCodes: Yup.string().required("ICD Codes are required"),
    }),

    treatmentPlan: Yup.object({
      prescribedMedications: Yup.object({
        medication: Yup.string().required("Prescribed Medication is required"),
        dosage: Yup.string().required("Medication Dosage is required"),
        instructions: Yup.string().required("Medication Instructions are required"),
      }),
      nonPharmacologicalInterventions: Yup.string().required("Non-Pharmacological Interventions are required"),
    }),

    proceduresPerformed: Yup.object({
      name: Yup.string().required("Procedure Name is required"),
      date: Yup.string().required("Procedure Date is required"),
      outcome: Yup.string().required("Procedure Outcome is required"),
    }),

    laboratoryTests: Yup.object({
      test: Yup.string().required("Laboratory Test is required"),
      results: Yup.string().required("Test Results are required"),
      dateOfResults: Yup.string().required("Results Date is required"),
    }),

    imagingStudies: Yup.object({
      type: Yup.string().required("Imaging Type is required"),
      date: Yup.string().required("Imaging Date is required"),
      resultsSummary: Yup.string().required("Results Summary is required"),
    }),

    referrals: Yup.object({
      specialist: Yup.string().required("Specialist information is required"),
      reasonForReferral: Yup.string().required("Referral Reason is required"),
    }),

    followUpInstructions: Yup.object({
      nextAppointmentDate: Yup.string().required("Next Appointment Date is required"),
      specificInstructions: Yup.string().required("Specific Instructions are required"),
    }),

    progressNotes: Yup.string().required("Progress Notes are required"),
  }),
});

export type MarketplaceFormData = Yup.InferType<typeof MarketplaceSchema>;