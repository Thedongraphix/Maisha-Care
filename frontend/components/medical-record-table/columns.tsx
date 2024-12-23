import { DataTableColumnHeader } from "@/components/table/data-table-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MedicalRecordType } from "@/types/api-types";
import { Checkbox } from "@/components/ui/checkbox";
import { SealCheck } from "@phosphor-icons/react";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export const MedicaRecordDataColumns: ColumnDef<MedicalRecordType>[] = [
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
    accessorKey: "patientId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient ID" />
    ),
  },
  {
    accessorKey: "visitDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visit Date" />
    ),
  },
  {
    accessorKey: "diagnosis",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Diagnosis" />
    ),
  },
  {
    accessorKey: "treatment",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Treatment" />
    ),
  },
  {
    accessorKey: "doctor",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Doctor" />
    ),
    cell: ({ cell }) => {
      return cell.row.original.doctor.name;
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Notes" />
    ),
  },
  {
    accessorKey: "followUpDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Follow Up Date" />
    ),
  },
  {
    accessorKey: "labResults",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lab Results" />
    ),
    cell: ({ cell }) => {
      return cell.row.original.labResults?.map((element) => {
        return (
          <ul>
            <li>{element.testName}</li>
            <li>{element.normalRange}</li>
            <li>{element.result}</li>
          </ul>
        );
      });
    },
  },
];

const DropDown = ({ cell }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <button className="py-3 px-5 w-[120px] bg-[#218B531A] text-[#218B53] rounded-lg hover:font-semibold mx-1">
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
