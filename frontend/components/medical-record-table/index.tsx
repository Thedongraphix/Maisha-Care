import { DataTable } from "@/components/table/data-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MagnifyingGlass } from "@phosphor-icons/react";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useWriteContract } from "wagmi";

interface TblProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function MedicalRecordTable<TData, TValue>({
  columns,
  data,
}: TblProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const { writeContract } = useWriteContract()

  // const handleMonetizeData = ()=> {
  //   () => 
  //     writeContract({ 
  //       abi,
  //       address: '0x6b175474e89094c44da98b954eedeac495271d0f',
  //       functionName: 'transferFrom',
  //       args: [
  //         '0xd2135CfB216b74109775236E36d4b433F1DF507B',
  //         '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  //         '123n',
  //       ],
  //    })
  // }

  return (
    <DataTable table={table} columns={columns} data={data}>
      <div  className="flex items-center justify-between my-1 p-3">
        <div className="flex items-center border border-[#ccc] rounded-full px-2 w-1/2">
          <MagnifyingGlass size={24} color="#1e1e1e" weight="bold" />
          <input
            type="text"
            className="outline-none p-2 w-full"
            placeholder="Search Record by Record ID"
            value={(table.getColumn("patientId")?.getFilterValue() as string) ?? ""}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              table
                .getColumn("patientId")
                ?.setFilterValue(event.currentTarget.value);
              table.getColumn("visitDate")?.setFilterValue("");
              table.getColumn("diagnosis")?.setFilterValue("");
              table.getColumn("treatment")?.setFilterValue("");
            }}
          />
        </div>
        <Controller
          name="region"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              value={
                (table.getColumn("visitDate")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value: string) => {
                table.getColumn("visitDate")?.setFilterValue(value);
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("diagnosis")?.setFilterValue("");
                table.getColumn("treatment")?.setFilterValue("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-[#A5A5A520] outline-none m-1">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                <SelectItem value="all">-- All Titles --</SelectItem>
                <SelectItem value="ngong">Ngong</SelectItem>
                <SelectItem value="nyeri">Nyeri</SelectItem>
                <SelectItem value="kisii">Kisii</SelectItem>
                <SelectItem value="embu">Embu</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <Controller
          name="sizes"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              value={
                (table.getColumn("patientId")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value: string) => {
                table.getColumn("patientId")?.setFilterValue(value);
                table.getColumn("visitDate")?.setFilterValue("");
                table.getColumn("diagnosis")?.setFilterValue("");
                table.getColumn("treatment")?.setFilterValue("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-[#A5A5A520] text-[#808195]  outline-none m-1">
                <SelectValue placeholder="Data Period" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                <SelectItem value="all">-- All Assets--</SelectItem>
                <SelectItem value="0.40">0.05Ha - 0.40Ha</SelectItem>
                <SelectItem value="2">0.41Ha - 2.0Ha</SelectItem>
                <SelectItem value="8">2.01Ha - 8.1Ha </SelectItem>
                <SelectItem value="8.2">8.2Ha +</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {/* <Controller
          name="periods"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              value={
                (table.getColumn("size")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value: string) => {
                table.getColumn("size")?.setFilterValue(value);
                table.getColumn("visitDate")?.setFilterValue("");
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("treatment")?.setFilterValue("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-[#A5A5A520] text-[#808195]  outline-none m-1">
                <SelectValue placeholder="Asset Size" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                <SelectItem value="all">-- All Periods--</SelectItem>
                <SelectItem value="0.40">1990s</SelectItem>
                <SelectItem value="2">0.41Ha - 2.0Ha</SelectItem>
                <SelectItem value="8">2.01Ha - 8.1Ha </SelectItem>
                <SelectItem value="8.2">8.2Ha +</SelectItem>
              </SelectContent>
            </Select>
          )}
        /> */}
      </div>
    </DataTable>
  );
}
