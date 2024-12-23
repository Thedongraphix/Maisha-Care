"use client";

import React, { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { PatientDataColumns } from "./columns";
import PatientTable from ".";
import { PatientType } from "@/types/api-types";
import { patientHealthDataSource } from "@/helpers/patientSource";

const PatientData = ({ status }: { status: string }) => {

  // const getAllProperties = async () => {
  //   const res = await fetch(`${AtlasBackendApi}/admin/getAllProperties`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     credentials: "omit",
  //   });
  //   if (!res.ok) {
  //     throw new Error("Failed to fetch properties");
  //   }
  //   return res.json();
  // };

  // const { data, error, isLoading } = useQuery({
  //   queryKey: ["properties"],
  //   queryFn: getAllProperties,
  // });

  // console.log("data data", data);

  const generateTblData = (item: PatientType): PatientType => {
    return {
    id:item.id,
    firstName:item.firstName,
    lastName:item.lastName,
    dateOfBirth:item.dateOfBirth,
    gender:item.gender,
    contactNumber:item.contactNumber,
    email:item.email,
    address:item.address,
    emergencyContact:item.emergencyContact,
    medicalHistory:item.medicalHistory,
    };
  };

  const tableData = Array.isArray(patientHealthDataSource)
    ? patientHealthDataSource?.map((element: PatientType) => generateTblData(element))
    : // .filter((item) => item.status === status)
      [];
  console.log("table data", tableData);
  return (
    <article>
      <PatientTable columns={PatientDataColumns} data={tableData} />
    </article>
  );
};

export default PatientData;
