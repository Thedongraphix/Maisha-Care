"use client";

import React from 'react';
import SelectInput from "@/components/inputs/SelectInput";

const MedicalHistorySection = () => {
  return (
    <>
      <h3 className="text-2xl font-semibold mt-8">Medical History</h3>
      
      <h4 className="text-xl font-medium mt-4">Past Medical Conditions</h4>
      <SelectInput
        label="Condition"
        name="medicalHistory.pastMedicalConditions.condition"
      >
        <option value="">Select Condition</option>
        <option value="hypertension">Hypertension</option>
        <option value="diabetes">Diabetes</option>
        <option value="asthma">Asthma</option>
        <option value="heartDisease">Heart Disease</option>
        <option value="cancer">Cancer</option>
        <option value="other">Other</option>
      </SelectInput>
      {/* Add other medical history select inputs as needed */}
    </>
  );
};

export default MedicalHistorySection; 