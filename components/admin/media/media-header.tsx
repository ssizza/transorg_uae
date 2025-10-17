"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, FolderPlus, Upload, Home, ChevronRight } from "lucide-react"

interface MediaHeaderProps {
  currentPath: string[]
  searchQuery: string
  onSearchChange: (query: string) => void
  onBreadcrumbClick: (index: number) => void
  onCreateFolder: () => void
  onUpload: () => void
}

export function MediaHeader({
  currentPath,
  searchQuery,
  onSearchChange,
  onBreadcrumbClick,
  onCreateFolder,
  onUpload,
}: MediaHeaderProps) {
  const breadcrumbItems = currentPath.map((path, index) => ({
    name: path,
    isLast: index === currentPath.length - 1,
  }))

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-muted-foreground">
              <Home className="w-4 h-4" />
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  <span
                    className={item.isLast ? "text-foreground font-medium" : "hover:text-foreground cursor-pointer"}
                    onClick={() => !item.isLast && onBreadcrumbClick(index)}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </nav>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onCreateFolder}>
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>

            <Button size="sm" onClick={onUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
