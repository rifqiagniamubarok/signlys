import { Card } from '@nextui-org/react';
import { FileIcon, FileUp } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropFileProps {
  onDrop: (acceptedFiles: File[]) => void;
}

const DropFile: React.FC<DropFileProps> = ({ onDrop }) => {
  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  return (
    <div {...getRootProps()} className="cursor-pointer ">
      <input {...getInputProps()} />
      <Card className="p-2 hover:bg-secondary bg-white dark:bg-dark-gray dark:hover:bg-opacity-80 dark:text-secondary">
        <div className="p-4 border-2 border-dashed border-dark-gray dark:border-secondary rounded-md">
          <div className="w-full flex justify-center items-center">
            <FileUp size={40} />
          </div>
          <div>
            <p className="text-xl mt-4 font-semibold">Select your pdf here or drop here</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
export default DropFile;