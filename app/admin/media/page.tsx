import { MediaManagement } from "@/components/admin/media/media-management"

export default function MediaPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-semibold">Media Library</h1>
      <MediaManagement />
    </div>
  )
}
