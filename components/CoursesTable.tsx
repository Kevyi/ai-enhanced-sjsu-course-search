"use client";

import {Section} from "@/lib/sjsu/section";
import {use} from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable
} from "@tanstack/react-table";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {DataTablePagination} from "@/components/ui/table-pagination";
import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";

const columns: ColumnDef<Section>[] = [
    {
        accessorKey: "section",
        header: "Section",
        cell: ({row, }) => {
            const section: string = row.getValue("section");
            const section_url = row.original.section_url;
            if (!section_url) {
                return section;
            }
            return <a href={section_url}>{section}</a>;
        }
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
        header: "Instructor",
        cell: ({row, }) => {
            const instructor: string = row.getValue("instructor");
            const instructor_email = row.original.instructor_email;
            if (!instructor_email) {
                return instructor;
            }
            return <a href={"mailto:" + instructor_email}>{instructor}</a>;
        }
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
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString",
        initialState: {
            pagination: {
                pageSize: 100
            }
        }
    })

    return (
        <div className="space-y-2">
            <Input placeholder="Search..." onChange={e => {
                table.setGlobalFilter(e.target.value)
            }}/>
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