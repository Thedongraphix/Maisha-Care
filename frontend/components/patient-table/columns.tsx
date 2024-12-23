import { DataTableColumnHeader } from "@/components/table/data-table-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PatientType } from "@/types/api-types";
import { Checkbox } from "@/components/ui/checkbox";
import { SealCheck } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export const PatientDataColumns: ColumnDef<PatientType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact Number" />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "emergencyContact",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Emergency Contact" />
    ),
  },
  {
    accessorKey: "medicalHistory",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Medical History" />
    ),
  },
  {
    id: "actions",
    accessorKey: "ACTIONS",
    header: "Actions",
    cell: ({ cell }) => {
      return <RequestData />;
    },
  },
];

import React from "react";
import LoadingDialog from "../dialog/LoadingDialog";
import SuccessDialog from "../dialog/SuccessDialog";

const RequestData = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRequestData = async () => {
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
    <>
      <button
        onClick={handleRequestData}
        className="py-2 px-2  bg-[#ff6f91] text-white rounded-lg font-semibold mx-1 w-max"
      >
        Request Data
      </button>
      <LoadingDialog
        openLoading={loading}
        setOpenLoading={setLoading}
        message={"Requesting Read Access to Data"}
      />
      <SuccessDialog
        openSuccess={success}
        setOpenSuccess={setSuccess}
        message={"Access Granted"}
      />
    </>
  );
};

const DropDown = ({ cell }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <button className="py-3 px-5 w-[120px] bg-[#218B531A] text-[#ff6f91] rounded-lg hover:font-semibold mx-1">
            View
          </button>
        </DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-screen">
          <DialogHeader>
            <DialogTitle className="mb-[20px]">
              Property {cell.row.original?.titleLR}
            </DialogTitle>
            <div className=" rounded-xl hover:cursor-pointer flex flex-col w-full">
              <article className="p-3">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-xl">
                    {cell.row.original?.titleLR}
                  </h4>
                  <span className="flex items-center ">
                    <SealCheck size={24} color="#398DEE" weight="fill" />
                    <h4 className="my-2 text-[#398DEE]">
                      {cell.row.original?.status}
                    </h4>
                  </span>
                </div>
                <span className="flex justify-between items-center">
                  <h4 className=" mb-3">
                    <span className="font-semibold">
                      {cell.row.original?.sizeHa} Ha
                    </span>
                  </h4>
                </span>
                <span className="flex justify-between items-center">
                  <h4 className=" mb-3">
                    <span className="font-semibold">
                      {cell.row.original?.leaseType}
                    </span>
                  </h4>
                  <p className=" mb-3">
                    <span className="font-semibold">
                      {cell.row.original?.acquistionType}
                    </span>{" "}
                  </p>
                </span>
                <span className="flex justify-between items-center">
                  <h4 className=" mb-3">
                    <span className="font-semibold">
                      {cell.row.original?.leaseType}
                    </span>
                  </h4>
                  <p className=" mb-3">
                    <span className="font-semibold">
                      {cell.row.original?.acquistionType}
                    </span>{" "}
                  </p>
                </span>
                <span className="flex justify-between items-center">
                  <h4 className=" mb-3">
                    <span className="font-semibold">
                      {cell.row.original?.ownerName}
                    </span>
                  </h4>
                </span>
                <div className="flex justify-between"></div>
              </article>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
};
