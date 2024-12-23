"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import PatientData from "./patients";

const PatientTableContainer = () => {
  return (
    <main className="m-3 rounded-lg p-3 bg-white shadow-md">
        <article>
          <Tabs defaultValue="properties" className="w-auto">
            <TabsList>
              <TabsTrigger value="properties">All Patients</TabsTrigger>
              <TabsTrigger value="verified">Verified Patients</TabsTrigger>
              <TabsTrigger value="pending">Pending Verification</TabsTrigger>
              <TabsTrigger value="failed">Rejected Patients</TabsTrigger>
            </TabsList>
            <TabsContent value="properties">
              <PatientData status="sold" />
            </TabsContent>
            <TabsContent value="verified">
              <PatientData status="inspection" />
            </TabsContent>
            <TabsContent value="pending">
              <PatientData status="pending" />
            </TabsContent>
            <TabsContent value="failed">
              <PatientData status="unverified" />
            </TabsContent>
          </Tabs>
        </article>
      </main>
  );
};

export default PatientTableContainer;
