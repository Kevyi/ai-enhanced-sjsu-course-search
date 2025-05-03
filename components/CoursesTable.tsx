"use client";

import { use, useState, useEffect, useRef } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MessageSquare, Trash2, X } from "lucide-react";

import { SectionWithRMP } from "@/lib/sjsu/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

interface Message {
  sender: "user" | "assistant" | "ai";
  text: string;
  timestamp: string;
  context?: {
    lastCourseCode?: string;
    lastInstructor?: string;
    lastInstructorEmail?: string;
  };
}

export default function AiChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: input,
          context: messages.length > 0 ? {
            lastCourseCode: messages[messages.length - 1].context?.lastCourseCode,
            lastInstructor: messages[messages.length - 1].context?.lastInstructor,
            lastInstructorEmail: messages[messages.length - 1].context?.lastInstructorEmail,
          } : undefined,
        }),
      });

      console.log("Debug: Response status:", response.status);
      const data = await response.json();
      console.log("Debug: Received data:", data);

      if (!data.reply) {
        console.error("Debug: No reply in response:", data);
        throw new Error("Invalid response format");
      }

      const aiMessage: Message = {
        text: data.reply,
        sender: "ai",
        timestamp: new Date().toISOString(),
        context: data.context,
      };

      console.log("Debug: Created AI message:", aiMessage);
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage: Message = {
        text: "Sorry, I encountered an error. Please try again.",
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  };

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl w-96 h-[600px] flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Course Assistant</h2>
            <div className="flex space-x-2">
              <button
                onClick={clearChat}
                className="text-gray-500 hover:text-gray-700 p-1"
                title="Clear chat"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              console.log("Debug: Rendering message:", message);
              return (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.text}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 text-gray-800">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about courses..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
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
        <AiChatBox />
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

  // Handler to remove course from local cart
  function removeFromCart(classNumber: string) {
    setCart((prev) => prev.filter((c) => c.class_number !== classNumber));
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
      <div className="mt-4 p-4 border rounded-lg">
        <h2 className="font-bold">Your Cart</h2>
        {cart.length === 0 ? (
          <p>No courses added yet.</p>
        ) : (
          <div className="space-y-2">
            {cart.map((course) => (
              <div key={course.class_number} className="flex items-center justify-between">
                <span>{course.course_title} – Section {course.section}</span>
                <button
                  onClick={() => removeFromCart(course.class_number)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
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
