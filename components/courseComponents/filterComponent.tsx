import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

const TopicFilterForm = () => {
  const topTags = [
    { label: "Array", count: 1894 },
    { label: "String", count: 785 },
    { label: "Hash Table", count: 689 },
    { label: "Dynamic Programming", count: 580 },
    { label: "Math", count: 575 },
    { label: "Sorting", count: 446 },
    { label: "Greedy", count: 410 },
  ]

  const categories = ["Algorithms", "Database", "Shell", "Concurrency", "JavaScript"]

  return (
    <form className="bg-background text-foreground p-4 rounded-md space-y-4">
      {/* Top Tags */}
      <div className="flex flex-wrap gap-2 text-sm">
        {topTags.map(({ label, count }) => (
          <span
            key={label}
            className="bg-muted px-3 py-1 rounded-full cursor-pointer hover:bg-muted/70"
          >
            {label} <span className="text-muted-foreground">{count}</span>
          </span>
        ))}
        <button className="text-muted-foreground text-sm hover:text-foreground ml-2">Expand ▾</button>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" className="rounded-full">All Topics</Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant="outline"
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Lists" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="list1">List 1</SelectItem>
            <SelectItem value="list2">List 2</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Tags" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dp">DP</SelectItem>
            <SelectItem value="graph">Graph</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Search questions" className="w-60" />

        <Button variant="ghost" size="icon">
          <span className="material-icons">settings</span>
        </Button>

        <Button variant="default" className="bg-green-500 hover:bg-green-600 rounded-full">
          Pick One
        </Button>
      </div>
    </form>
  )
}

export default TopicFilterForm
