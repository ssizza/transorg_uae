"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Grid3X3, List, Trash2 } from "lucide-react"

interface MediaToolbarProps {
  selectedItems: number[]
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onSelectAll: () => void
  onDeleteSelected: () => void
  totalItems: number
}

export function MediaToolbar({
  selectedItems,
  viewMode,
  onViewModeChange,
  onSelectAll,
  onDeleteSelected,
  totalItems,
}: MediaToolbarProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        {selectedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedItems.length} selected</Badge>
            <Button variant="destructive" size="sm" onClick={onDeleteSelected}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("grid")}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "outline"}
          size="sm"
          onClick={() => onViewModeChange("list")}
        >
          <List className="w-4 h-4" />
        </Button>
        <Checkbox checked={selectedItems.length === totalItems && totalItems > 0} onCheckedChange={onSelectAll} />
        <Label className="text-sm">Select All</Label>
      </div>
    </div>
  )
}
