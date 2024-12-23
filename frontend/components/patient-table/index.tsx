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

interface TblProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export default function PatientTable<TData, TValue>({
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
  return (
    <DataTable table={table} columns={columns} data={data}>
      <div  className="flex items-center justify-between my-1 p-3">
        <div className="flex items-center border border-[#ccc] rounded-full px-2 w-1/2">
          <MagnifyingGlass size={24} color="#1e1e1e" weight="bold" />
          <input
            type="text"
            className="outline-none p-2 w-full"
            placeholder="Search Patient by Name"
            value={(table.getColumn("titleLR")?.getFilterValue() as string) ?? ""}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              table
                .getColumn("titleLR")
                ?.setFilterValue(event.currentTarget.value);
              table.getColumn("county")?.setFilterValue("");
              table.getColumn("sizeHa")?.setFilterValue("");
              table.getColumn("leaseType")?.setFilterValue("");
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
                (table.getColumn("county")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value: string) => {
                table.getColumn("county")?.setFilterValue(value);
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("sizeHa")?.setFilterValue("");
                table.getColumn("leaseType")?.setFilterValue("");
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
                (table.getColumn("sizeHa")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value: string) => {
                table.getColumn("sizeHa")?.setFilterValue(value);
                table.getColumn("county")?.setFilterValue("");
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("leaseType")?.setFilterValue("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-[#A5A5A520] text-[#808195]  outline-none m-1">
                <SelectValue placeholder="Asset Size" />
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
        <Controller
          name="property type"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              value={
                (table.getColumn("leaseType")?.getFilterValue() as string) ?? ""
              }
              onValueChange={(value: string) => {
                table.getColumn("leaseType")?.setFilterValue(value);
                table.getColumn("county")?.setFilterValue("");
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("sizeHa")?.setFilterValue("");
              }}
            >
              <SelectTrigger className="w-[200px] bg-[#A5A5A520] text-[#808195]  outline-none m-1">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#ffffff] text-[#808195] bg-opacity-100">
                <SelectItem defaultValue="" value="all">
                  All Titles
                </SelectItem>
                <SelectItem value="freehold">Freehold Titles</SelectItem>
                <SelectItem value="leasehold">Leasehold Titles</SelectItem>
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
                table.getColumn("county")?.setFilterValue("");
                table.getColumn("name")?.setFilterValue("");
                table.getColumn("leaseType")?.setFilterValue("");
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
