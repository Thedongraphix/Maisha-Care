import { MedicalRecordType } from "@/types/api-types";

export const medicalRecordSource: MedicalRecordType[] = [
  {
    patientId: "P001",
    visitDate: new Date("2024-09-20"),
    diagnosis: "Upper Respiratory Infection",
    treatment: "Prescribed antibiotics and rest",
    doctor: {
      name: "Dr. Sarah Lee",
      specialty: "General Practitioner"
    },
    notes: "Patient advised to avoid strenuous activities and stay hydrated. Follow-up if symptoms persist.",
    followUpDate: new Date("2024-09-30"),
    labResults: [
      {
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "4,500 to 11,000 white blood cells per microliter"
      },
      {
        testName: "Throat Culture",
        result: "Positive for Streptococcus",
        normalRange: "Negative"
      }
    ]
  },
  {
    patientId: "P002",
    visitDate: new Date("2024-08-15"),
    diagnosis: "Type 2 Diabetes",
    treatment: "Metformin prescribed, diet plan recommended",
    doctor: {
      name: "Dr. Emily Carter",
      specialty: "Endocrinologist"
    },
    notes: "Regular exercise and blood sugar monitoring advised.",
    followUpDate: new Date("2024-09-15"),
    labResults: [
      {
        testName: "HbA1c",
        result: "7.5%",
        normalRange: "Below 5.7%"
      }
    ]
  },
  {
    patientId: "P003",
    visitDate: new Date("2024-07-30"),
    diagnosis: "Hypertension",
    treatment: "Lisinopril prescribed, blood pressure monitoring",
    doctor: {
      name: "Dr. James Brooks",
      specialty: "Cardiologist"
    },
    notes: "Patient to reduce sodium intake and increase physical activity.",
    followUpDate: new Date("2024-08-28"),
    labResults: [
      {
        testName: "Blood Pressure",
        result: "150/95 mmHg",
        normalRange: "Less than 120/80 mmHg"
      }
    ]
  },
  {
    patientId: "P004",
    visitDate: new Date("2024-06-12"),
    diagnosis: "Seasonal Allergies",
    treatment: "Antihistamines prescribed",
    doctor: {
      name: "Dr. Samantha Miller",
      specialty: "Allergist"
    },
    notes: "Patient advised to avoid known allergens and use nasal sprays.",
    labResults: [
      {
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "4,500 to 11,000 white blood cells per microliter"
      },
      {
        testName: "Throat Culture",
        result: "Positive for Streptococcus",
        normalRange: "Negative"
      }
    ]
  },
  {
    patientId: "P005",
    visitDate: new Date("2024-08-05"),
    diagnosis: "Anemia",
    treatment: "Iron supplements prescribed",
    doctor: {
      name: "Dr. Aaron Wilson",
      specialty: "Hematologist"
    },
    notes: "Patient advised to increase dietary iron intake.",
    followUpDate: new Date("2024-09-05"),
    labResults: [
      {
        testName: "Hemoglobin",
        result: "10 g/dL",
        normalRange: "13.5 to 17.5 g/dL"
      }
    ]
  },
  {
    patientId: "P006",
    visitDate: new Date("2024-07-18"),
    diagnosis: "Migraine",
    treatment: "Sumatriptan prescribed",
    doctor: {
      name: "Dr. Karen Reed",
      specialty: "Neurologist"
    },
    notes: "Patient advised to track triggers and avoid stress.",
    followUpDate: new Date("2024-08-17"),
    labResults: [
      {
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "4,500 to 11,000 white blood cells per microliter"
      },
      {
        testName: "Throat Culture",
        result: "Positive for Streptococcus",
        normalRange: "Negative"
      }
    ]
  },
  {
    patientId: "P007",
    visitDate: new Date("2024-05-10"),
    diagnosis: "Hyperlipidemia",
    treatment: "Statins prescribed, dietary changes recommended",
    doctor: {
      name: "Dr. Michael Green",
      specialty: "Cardiologist"
    },
    notes: "Patient advised to reduce fat intake and monitor cholesterol.",
    labResults: [
      {
        testName: "Lipid Panel",
        result: "LDL 160 mg/dL",
        normalRange: "Less than 100 mg/dL"
      }
    ]
  },
  {
    patientId: "P008",
    visitDate: new Date("2024-06-22"),
    diagnosis: "Bronchitis",
    treatment: "Rest, hydration, and cough suppressant prescribed",
    doctor: {
      name: "Dr. Linda Brown",
      specialty: "Pulmonologist"
    },
    notes: "Patient to avoid irritants and rest. Symptoms should clear within two weeks.",
    labResults: [
      {
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "4,500 to 11,000 white blood cells per microliter"
      },
      {
        testName: "Throat Culture",
        result: "Positive for Streptococcus",
        normalRange: "Negative"
      }
    ]
  },
  {
    patientId: "P009",
    visitDate: new Date("2024-07-02"),
    diagnosis: "Acute Appendicitis",
    treatment: "Appendectomy performed",
    doctor: {
      name: "Dr. Steven Adams",
      specialty: "Surgeon"
    },
    notes: "Post-op recovery monitored, no complications.",
    followUpDate: new Date("2024-07-16"),
    labResults: [
      {
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "4,500 to 11,000 white blood cells per microliter"
      },
      {
        testName: "Throat Culture",
        result: "Positive for Streptococcus",
        normalRange: "Negative"
      }
    ]
  },
  {
    patientId: "P010",
    visitDate: new Date("2024-09-01"),
    diagnosis: "Gastroesophageal Reflux Disease (GERD)",
    treatment: "Proton pump inhibitors prescribed",
    doctor: {
      name: "Dr. Patricia Davis",
      specialty: "Gastroenterologist"
    },
    notes: "Patient advised to avoid spicy foods and elevate head during sleep.",
    labResults: [
      {
        testName: "Complete Blood Count (CBC)",
        result: "Normal",
        normalRange: "4,500 to 11,000 white blood cells per microliter"
      },
      {
        testName: "Throat Culture",
        result: "Positive for Streptococcus",
        normalRange: "Negative"
      }
    ]
  }
];
