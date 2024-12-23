"use client"
import { File } from "@phosphor-icons/react";
import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";


const DashboardAdmin = () => {
  // console.log("user accessToken",session?.user.accesstokens)
   const getAllTotalValues = async () => {
    const res = await fetch(`/admin/totalProperties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "omit",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }
    return res.json();
  };

  const { data, error, isLoading } = useQuery({queryKey:["totalValues"],queryFn: getAllTotalValues});
  

  return (
    <main className="bg-dash-hero-bg bg-cover text-white p-4 m-3 h-[250px] flex flex-col justify-around rounded-xl font-DM">
      <h4>Welcome </h4>
      <article className="flex justify-around">
        <Link
          href="/admin/property"
          className="flex flex-col items-start bg-white rounded-xl p-4 w-[300px] m-1"
        >
          <span className="bg-[#218b523d] p-3 flex flex-col items-center rounded-lg">
            <File size={24} color="#080808" weight="fill" />
          </span>
          <h3 className="font-bold text-[#718096] my-2">Total Patients</h3>
          <h3 className="font-bold text-black text-3xl">13</h3>
        </Link>
        <Link
          href="/admin/users"
          className="flex flex-col items-start bg-white rounded-xl p-4 w-[300px] m-1"
        >
          <span className="bg-[#218b523d] p-3 flex flex-col items-center rounded-lg">
            <File size={24} color="#080808" weight="fill" />
          </span>
          <h3 className="font-bold text-[#718096] my-2">Total users</h3>
          <h3 className="font-bold text-black text-3xl">200</h3>
        </Link>
        <Link
          href="/admin/disputes"
          className="flex flex-col items-start bg-white rounded-xl p-4 w-[300px] m-1"
        >
          <span className="bg-[#218b523d] p-3 flex flex-col items-center rounded-lg">
            <File size={24} color="#080808" weight="fill" />
          </span>
          <h3 className="font-bold text-[#718096] my-2">Total Records</h3>
          <h3 className="font-bold text-black text-3xl">2309</h3>
        </Link>
        <Link
          href="/admin/transfers"
          className="flex flex-col items-start bg-white rounded-xl p-4 w-[300px] m-1"
        >
          <span className="bg-[#218b523d] p-3 flex flex-col items-center rounded-lg">
            <File size={24} color="#080808" weight="fill" />
          </span>
          <h3 className="font-bold text-[#718096] my-2">Total Analysed</h3>
          <h3 className="font-bold text-black text-3xl">283</h3>
        </Link>
        <Link
          href="/admin/accounts"
          className="flex flex-col items-start bg-white rounded-xl p-4 w-[300px] m-1"
        >
          <span className="bg-[#218b523d] p-3 flex flex-col items-center rounded-lg">
            <File size={24} color="#080808" weight="fill" />
          </span>
          <h3 className="font-bold text-[#718096] my-2">Account Balance</h3>
          <h3 className="font-bold text-black text-3xl">KES 564,750</h3>
        </Link>
      </article>
    </main>
  );
};

export default DashboardAdmin;
