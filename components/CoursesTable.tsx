"use client";

import { use, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { SectionWithRMP } from "@/lib/sjsu/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

// --------------------------------------------------------------------
// 1) AIChatBox with a Close (X) button that's red
// --------------------------------------------------------------------
function AiChatBox({ onClose }: { onClose: () => void }) {
  interface Message {
    sender: "user" | "assistant";
    text: string;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user's message to local state
    setMessages((prev) => [...prev, { sender: "user", text: userInput }]);

    try {
      // Call our /api/chat endpoint
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage: userInput }),
      });
      const data = await res.json();

      if (data.reply) {
        // Add AI's response
        setMessages((prev) => [...prev, { sender: "assistant", text: data.reply }]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle errors here if desired
    }

    // Clear input
    setUserInput("");
  }

  return (
    <div className="relative border rounded p-4 w-full max-w-md bg-white shadow">
      {/* X button made red */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
      >
        ✕
      </button>

      <h2 className="text-lg font-bold mb-2">AI Chatbox</h2>
      <div className="h-64 overflow-y-auto border p-2 mb-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.sender === "user" ? "You" : "AI"}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="flex-1 border rounded px-2 py-1"
          placeholder="Type a message..."
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md">
          Send
        </button>
      </form>
    </div>
  );
}

// --------------------------------------------------------------------
// 2) ChatToggle: a floating icon that toggles the chat box
// --------------------------------------------------------------------
function AiChatToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <AiChatBox onClose={() => setIsOpen(false)} />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow"
          aria-label="Open AI Chat"
        >
          💬
        </button>
      )}
    </div>
  );
}

// --------------------------------------------------------------------
// 3) Base columns for the Courses Table
// --------------------------------------------------------------------
const baseColumns: ColumnDef<SectionWithRMP>[] = [
  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => {
      const section: string = row.getValue("section");
      const section_url = row.original.section_url;
      return section_url ? <a href={section_url}>{section}</a> : section;
    },
  },
  {
    accessorKey: "class_number",
    header: "Class Number",
  },
  {
    accessorKey: "instruction_mode",
    header: "Instruction Mode",
  },
  {
    accessorKey: "course_title",
    header: "Course Title",
  },
  {
    accessorKey: "satisfies",
    header: "Satisfies",
  },
  {
    accessorKey: "units",
    header: "Units",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "days",
    header: "Days",
  },
  {
    accessorKey: "times",
    header: "Times",
  },
  {
    accessorKey: "instructor",
    header: "Instructor",
    cell: ({ row }) => {
      const instructor: string = row.getValue("instructor");
      const instructor_email = row.original.instructor_email;
      return instructor_email ? <a href={"mailto:" + instructor_email}>{instructor}</a> : instructor;
    },
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "dates",
    header: "Dates",
  },
  {
    accessorKey: "open_seats",
    header: "Open Seats",
  },
  {
    accessorKey: "notes",
    header: "Notes",
  },
  {
    accessorKey: "rmp",
    header: "Rating",
    cell: ({ row }) => {
      const rating = row.original.rmp?.avgRating;
      return rating ? rating + "/5" : "N/A";
    },
  },
];

// --------------------------------------------------------------------
// 4) CoursesTable that includes a "Cart" column + the floating Chat icon
// --------------------------------------------------------------------
export function CoursesTable({
  sectionsPromise,
}: {
  sectionsPromise: Promise<SectionWithRMP[]>;
}) {
  // Local state for the cart
  const [cart, setCart] = useState<SectionWithRMP[]>([]);

  // Handler to add course to local cart
  function addToCart(course: SectionWithRMP) {
    setCart((prev) =>
      prev.find((c) => c.class_number === course.class_number) ? prev : [...prev, course]
    );
  }

  // Resolve the data from the promise
  const sections = use(sectionsPromise);

  // Add an extra "Select Course" column
  const columns: ColumnDef<SectionWithRMP>[] = [
    ...baseColumns,
    {
      id: "cart",
      header: "Cart",
      cell: ({ row }) => (
        <button
          onClick={() => addToCart(row.original)}
          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
        >
          Select Course
        </button>
      ),
    },
  ];

  // Setup TanStack Table
  const table = useReactTable({
    data: sections,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    initialState: { pagination: { pageSize: 100 } },
  });

  return (
    <div className="space-y-4">
      {/* Search/filter input */}
      <Input
        placeholder="Search..."
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />

      {/* Cart Preview */}
      <div className="border p-4">
        <h2 className="font-bold">Your Cart</h2>
        {cart.length === 0 ? (
          <p>No courses added yet.</p>
        ) : (
          cart.map((course) => (
            <div key={course.class_number}>
              {course.course_title} – Section {course.section}
            </div>
          ))
        )}
      </div>

      {/* The floating chat toggler in the bottom-right */}
      <AiChatToggle />
    </div>
  );
}

// Optional fallback
export function FallbackTable() {
  return (
    <div className="space-y-2">
      <Skeleton className="w-full h-screen" />
    </div>
  );
}
