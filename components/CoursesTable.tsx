"use client";

import {Section} from "@/lib/sjsu/section";
import {use} from "react";
import {ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DataTablePagination} from "@/components/ui/table-pagination";
import {Skeleton} from "@/components/ui/skeleton";

const columns: ColumnDef<Section>[] = [
    {
        accessorKey: "section",
        header: "Section"
    },
    {
        accessorKey: "class_number",
        header: "Class Number"
    },
    {
        accessorKey: "instruction_mode",
        header: "Instruction Mode"
    },
    {
        accessorKey: "course_title",
        header: "Course Title"
    },
    {
        accessorKey: "satisfies",
        header: "Satisfies"
    },
    {
        accessorKey: "units",
        header: "Units"
    },
    {
        accessorKey: "type",
        header: "Type"
    },
    {
        accessorKey: "days",
        header: "Days"
    },
    {
        accessorKey: "times",
        header: "Times"
    },
    {
        accessorKey: "instructor",
        header: "Instructor"
    },
    {
        accessorKey: "location",
        header: "Location"
    },
    {
        accessorKey: "dates",
        header: "Dates"
    },
    {
        accessorKey: "open_seats",
        header: "Open Seats"
    },
    {
        accessorKey: "notes",
        header: "Notes"
    }
]

export function CoursesTable({sectionsPromise}: {sectionsPromise: Promise<Section[]>}) {
    const sections = use(sectionsPromise);
    const table = useReactTable({
        data: sections,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 100
            }
        }
    })

    return (
        <div className="space-y-2">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="h-24"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table}/>
        </div>
    );
}

export function FallbackTable() {
    return <div className="space-y-2">
        <Skeleton className="w-full h-screen"/>
    </div>
}