"use client";

import { CaretCircleRight } from "@phosphor-icons/react";
import Link from "next/link";
import React, { useState } from "react";
import LoadingDialog from "../dialog/LoadingDialog";
import SuccessDialog from "../dialog/SuccessDialog";

const DashboardHero = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleMonetizeData = async () => {
    setLoading(true);
    await setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
    await setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };
  return (
    <main className="bg-dash-hero-bg bg-cover text-white p-4 m-3 h-[250px] flex flex-col justify-around rounded-xl font-DM">
      <span>
        <h2 className="font-bold my-2 text-lg">Dear Patient</h2>
        <h4 className="font-bold text-3xl ">Welcome to MaishaCare </h4>
        <h2 className="font-bold m-2 text-lg">
          Your Health, Your Data, Your Control
        </h2>
      </span>
      <button
        onClick={handleMonetizeData}
        className="bg-black rounded-full flex py-2 px-4 items-center font-semibold w-[300px] justify-between"
      >
        Restrict Data Now
        <CaretCircleRight
          size={36}
          color="#fafafa"
          weight="bold"
          className="bg-[#ff6f91] rounded-full"
        />
      </button>
      <LoadingDialog
        openLoading={loading}
        setOpenLoading={setLoading}
        message={"Monetizing Your Data"}
      />
      <SuccessDialog
        openSuccess={success}
        setOpenSuccess={setSuccess}
        message={"Data Monetized"}
      />
    </main>
  );
};

export default DashboardHero;
