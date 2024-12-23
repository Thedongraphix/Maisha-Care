"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect } from "react";
import MedialRecordData from "./medical-records";

const MedicalRecordTableContainer = () => {
  return (
    <main className="m-3 rounded-lg p-3 bg-white shadow-md">
        <MedialRecordData status="unverified" />
      </main>
  );
};

export default MedicalRecordTableContainer;
