import { useUpload } from "../hooks/useUpload"
import { DropZone } from "./DropZone"
import { FileList } from "./FileList"

export const Uploader = () => {
  const { files, provider, setProvider, handleFiles, removeFile } = useUpload()

  return (
    <div className='bg-white p-8 rounded-3xl shadow-xl w-full max-w-5xl flex gap-8 min-h-[500px]'>
      <DropZone
        onFilesSelected={handleFiles}
        provider={provider}
        setProvider={setProvider}
      />
      <FileList files={files} onRemove={removeFile} />
    </div>
  )
}
