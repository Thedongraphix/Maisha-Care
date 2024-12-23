"use client";

import React, { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { MedicaRecordDataColumns } from "./columns";
import { MedicalRecordType } from "@/types/api-types";
import { medicalRecordSource } from "@/helpers/medicalRecord";
import MedicalRecordTable from ".";

const MedialRecordData = ({ status }: { status: string }) => {
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

  const generateTblData = (item: MedicalRecordType): MedicalRecordType => {
    return {
      patientId: item.patientId,
      visitDate: item.visitDate,
      diagnosis: item.diagnosis,
      treatment: item.treatment,
      doctor: item.doctor,
      notes: item.notes,
      followUpDate: item.followUpDate,
      labResults: item.labResults,
    };
  };

  const tableData = Array.isArray(medicalRecordSource)
    ? medicalRecordSource?.map((element: MedicalRecordType) =>
        generateTblData(element)
      )
    : // .filter((item) => item.status === status)
      [];
  console.log("table data", tableData);
  return (
    <article>
      <MedicalRecordTable columns={MedicaRecordDataColumns} data={tableData} />
    </article>
  );
};

export default MedialRecordData;
