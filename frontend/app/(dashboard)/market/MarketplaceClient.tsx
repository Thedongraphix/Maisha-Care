"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextInput from "@/components/inputs/TextInput";

const MarketplaceClient = () => {
  const [DynamicSections, setDynamicSections] = useState<{
    CurrentHealth?: React.ComponentType;
    MedicalHistory?: React.ComponentType;
    TreatmentRecords?: React.ComponentType;
  }>({});

  useEffect(() => {
    Promise.all([
      import('@/components/market/CurrentHealthSection'),
      import('@/components/market/MedicalHistorySection'),
      import('@/components/market/TreatmentRecordsSection')
    ]).then(([CurrentHealth, MedicalHistory, TreatmentRecords]) => {
      setDynamicSections({
        CurrentHealth: CurrentHealth.default,
        MedicalHistory: MedicalHistory.default,
        TreatmentRecords: TreatmentRecords.default
      });
    });
  }, []);

  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const SignupSchema = Yup.object({
    patientName: Yup.string().required("Patient's Name is Required"),
    bidAmount: Yup.number()
      .positive("Bid amount must be positive")
      .required("Bid Amount is Required"),
  });

  const handleSubmit = async (values: any) => {
    console.log(values);
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <section className="p-10">
      <article className="bg-white rounded-md shadow-sm p-10">
        <h2 className="text-4xl text-black font-bold mb-6">
          Bid for Health Record Data
        </h2>

        <Formik
          initialValues={{
            patientName: "",
            bidAmount: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form className="space-y-6">
              <TextInput
                label="Patient's Name"
                name="patientName"
                type="text"
                placeholder="Enter Patient's Name"
              />
              <TextInput
                label="Bid Amount ($)"
                name="bidAmount"
                type="number"
                placeholder="Enter your bid amount"
              />

              {DynamicSections.CurrentHealth && <DynamicSections.CurrentHealth />}
              {DynamicSections.MedicalHistory && <DynamicSections.MedicalHistory />}
              {DynamicSections.TreatmentRecords && <DynamicSections.TreatmentRecords />}

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <button
                type="submit"
                className="bg-black text-white mt-5 p-3 rounded-md font-bold w-full cursor-pointer"
              >
                Submit Bid
              </button>
            </Form>
          )}
        </Formik>
      </article>
    </section>
  );
};

export default MarketplaceClient; 