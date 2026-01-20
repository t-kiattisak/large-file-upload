import { useRef } from "react"
import { Upload } from "lucide-react"
import type { UploadProvider } from "../types"
import { cn } from "../utils"

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void
  provider: UploadProvider
  setProvider: (provider: UploadProvider) => void
}

export const DropZone = ({
  onFilesSelected,
  provider,
  setProvider,
}: DropZoneProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files?.length) {
      onFilesSelected(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      className='flex-1 border-2 border-dashed border-blue-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-blue-50/30 transition-colors hover:bg-blue-50/50'
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className='mb-6 p-4 bg-white rounded-full shadow-sm'>
        <Upload className='w-8 h-8 text-blue-500' />
      </div>

      <button
        onClick={() => fileInputRef.current?.click()}
        className='bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 mb-4 cursor-pointer'
      >
        Browse
      </button>

      <p className='text-gray-400 text-sm font-medium mb-8'>drop a file here</p>

      <div className='flex gap-4 items-center mb-8 bg-gray-100 p-1 rounded-lg'>
        <button
          onClick={() => setProvider("local")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
            provider === "local"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          Local
        </button>
        <button
          onClick={() => setProvider("s3")}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer",
            provider === "s3"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-700",
          )}
        >
          AWS S3
        </button>
      </div>

      <p className='text-gray-300 text-xs mt-auto'>
        *File supported .png, .jpg & .webp (and others)
      </p>

      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        multiple
        onChange={(e) =>
          e.target.files && onFilesSelected(Array.from(e.target.files))
        }
      />
    </div>
  )
}
