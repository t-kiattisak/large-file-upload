import { FileIcon, CheckCircle, AlertCircle, X, Trash2 } from "lucide-react"
import type { FileUploadState } from "../types"
import { formatFileSize } from "../utils"

interface FileItemProps {
  item: FileUploadState
  onRemove: (id: string) => void
}

export const FileItem = ({ item, onRemove }: FileItemProps) => {
  return (
    <div className='group flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors'>
      <div className='p-3 bg-blue-50 rounded-lg text-blue-500'>
        <FileIcon className='w-6 h-6' />
      </div>

      <div className='flex-1 min-w-0'>
        <div className='flex justify-between items-center mb-1'>
          <p className='text-sm font-medium text-gray-700 truncate'>
            {item.file.name}
          </p>
        </div>

        {item.status === "uploading" && (
          <div className='w-full bg-gray-100 rounded-full h-1.5 overflow-hidden'>
            <div
              className='bg-blue-500 h-full transition-all duration-300 ease-out'
              style={{ width: `${item.progress}%` }}
            />
          </div>
        )}

        {item.status === "idle" && (
          <p className='text-xs text-gray-400'>Waiting...</p>
        )}

        {item.status === "success" && (
          <div className='flex items-center gap-1 text-xs text-green-600'>
            <CheckCircle className='w-3 h-3' />
            <span>Completed • {formatFileSize(item.file.size)}</span>
          </div>
        )}

        {item.status === "error" && (
          <div className='flex items-center gap-1 text-xs text-red-500'>
            <AlertCircle className='w-3 h-3' />
            <span>Failed</span>
          </div>
        )}
      </div>

      {/* Status / Action */}
      <div className='flex items-center gap-3'>
        {item.status === "uploading" && (
          <span className='text-xs font-semibold text-gray-400 w-8 text-right'>
            {Math.round(item.progress)}%
          </span>
        )}

        <button
          onClick={() => onRemove(item.id)}
          className='p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer'
        >
          {item.status === "uploading" ? (
            <X className='w-4 h-4' />
          ) : (
            <Trash2 className='w-4 h-4' />
          )}
        </button>
      </div>
    </div>
  )
}
