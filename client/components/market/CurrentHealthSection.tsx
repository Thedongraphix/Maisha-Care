"use client";

import React from 'react';
import SelectInput from "@/components/inputs/SelectInput";

const CurrentHealthSection = () => {
  return (
    <>
      <h3 className="text-2xl font-semibold mt-8">Current Health</h3>
      <SelectInput
        label="Condition"
        name="currentHealth.condition"
      >
        <option value="">Select Condition</option>
        <option value="hypertension">Hypertension</option>
        {/* ... other options */}
      </SelectInput>
    </>
  );
};

export default CurrentHealthSection; 