import type { FileUploadState } from "../types"
import { FileItem } from "./FileItem"

interface FileListProps {
  files: FileUploadState[]
  onRemove: (id: string) => void
}

export const FileList = ({ files, onRemove }: FileListProps) => {
  return (
    <div className='flex-1 flex flex-col'>
      <h3 className='text-gray-900 font-bold mb-6 text-lg'>Uploaded files</h3>

      <div className='flex-1 overflow-y-auto space-y-4 pr-2'>
        {files.length === 0 && (
          <div className='h-full flex flex-col items-center justify-center text-gray-300'>
            <p>No files uploaded yet</p>
          </div>
        )}

        {files.map((file) => (
          <FileItem key={file.id} item={file} onRemove={onRemove} />
        ))}
      </div>
    </div>
  )
}
