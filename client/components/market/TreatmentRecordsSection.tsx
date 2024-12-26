"use client";

import React from 'react';
import SelectInput from "@/components/inputs/SelectInput";

const TreatmentRecordsSection = () => {
  return (
    <>
      <h3 className="text-2xl font-semibold mt-8">Treatment Records</h3>
      
      <h4 className="text-xl font-medium mt-4">Visit Information</h4>
      <SelectInput
        label="Date of Visit"
        name="treatmentRecords.visitInformation.dateOfVisit"
      >
        <option value="">Select Time Frame</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
        <option value="older">Older</option>
      </SelectInput>
      {/* Add other treatment record select inputs as needed */}
    </>
  );
};

export default TreatmentRecordsSection; 