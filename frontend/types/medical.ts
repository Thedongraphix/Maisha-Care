export type MedicalFormData = {
    currentHealth: {
      vitalSigns: {
        bloodPressureSystolic: string;
        bloodPressureDiastolic: string;
        heartRate: string;
        respiratoryRate: string;
        bodyTemperature: string;
        oxygenSaturation: string;
      };
      bodyMeasurements: {
        height: string;
        weight: string;
      };
      generalHealth: {
        generalAppearance: string;
        levelOfConsciousness: string;
        painScore: string;
      };
      currentSymptoms: {
        primaryComplaint: string;
        durationOfSymptoms: string;
        severityOfSymptoms: string;
      };
      currentMedications: Array<{ 
        name: string; 
        dosage: string; 
        frequency: string;
      }>;
      allergies: Array<{ 
        allergy: string; 
        severity: string;
      }>;
      lifestyleFactors: {
        smokingStatus: string;
        alcoholConsumption: string;
        exerciseHabits: string;
        dietOverview: string;
      };
    };
    medicalHistory: {
      pastMedicalConditions: Array<{
        condition: string;
        yearDiagnosed: string;
        currentStatus: string;
      }>;
      surgicalHistory: Array<{ 
        surgery: string; 
        date: string; 
        complications: string;
      }>;
      familyMedicalHistory: Array<{ 
        condition: string; 
        relationship: string;
      }>;
      immunizationRecords: Array<{ 
        vaccination: string; 
        dateAdministered: string;
      }>;
      majorInjuries: Array<{
        description: string;
        dateOccurred: string;
        treatmentReceived: string;
      }>;
      chronicMedications: Array<{ 
        medication: string; 
        durationOfUse: string;
      }>;
      pastHospitalizations: Array<{ 
        reason: string; 
        dateAndDuration: string;
      }>;
      mentalHealthHistory: {
        diagnosedConditions: string;
        treatmentsReceived: string;
      };
      reproductiveHistory: {
        pregnancies: string;
        childbirthDetails: string;
      };
    };
    treatmentRecords: {
      visitInformation: {
        dateOfVisit: string;
        reasonForVisit: string;
        treatingPhysician: string;
      };
      diagnosis: {
        primaryDiagnosis: string;
        secondaryDiagnoses: string;
        icdCodes: string;
      };
      treatmentPlan: {
        prescribedMedications: Array<{
          medication: string;
          dosage: string;
          instructions: string;
        }>;
        nonPharmacologicalInterventions: string;
      };
      proceduresPerformed: Array<{ 
        name: string; 
        date: string; 
        outcome: string;
      }>;
      laboratoryTests: Array<{ 
        test: string; 
        results: string; 
        dateOfResults: string;
      }>;
      imagingStudies: Array<{ 
        type: string; 
        date: string; 
        resultsSummary: string;
      }>;
      referrals: Array<{ 
        specialist: string; 
        reasonForReferral: string;
      }>;
      followUpInstructions: {
        nextAppointmentDate: string;
        specificInstructions: string;
      };
      progressNotes: string;
    };
  };