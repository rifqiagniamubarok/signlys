'use client';

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs } from '@nextui-org/react';
import React, { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Upload } from 'lucide-react';

interface SignModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  onSave: (dataURL: string) => void;
}

const SignModal: React.FC<SignModalProps> = ({ isOpen, onOpenChange, onClose, onSave }) => {
  const signatureRef = useRef<SignatureCanvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('draw');

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
      setSignatureImage(null);
    }
    setUploadedImage(null);
    handleClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file (PNG or JPG)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target?.result as string;
        setUploadedImage(dataURL);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSignature = () => {
    if (activeTab === 'draw') {
      if (signatureRef.current && signatureRef.current.isEmpty()) {
        alert('Please provide a signature first!');
        return;
      } else if (signatureRef.current) {
        const dataURL = signatureRef.current.toDataURL();
        onSave(dataURL);
        setSignatureImage(dataURL);
      }
    } else if (activeTab === 'upload') {
      if (!uploadedImage) {
        alert('Please upload an image first!');
        return;
      }
      onSave(uploadedImage);
    }
    clearSignature();
    handleClose();
  };

  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
        <ModalContent>
          {(onCloseModal) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Signature</ModalHeader>
              <ModalBody>
                <Tabs aria-label="Signature options" selectedKey={activeTab} onSelectionChange={(key) => setActiveTab(key as string)}>
                  <Tab key="draw" title="Draw Signature">
                    <div className="bg-gray-200 dark:bg-gray-400 rounded-lg">
                      <SignatureCanvas
                        ref={signatureRef}
                        penColor="black"
                        canvasProps={{
                          width: 500,
                          height: 200,
                          className: 'sigCanvas',
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Draw your signature using your mouse or touchscreen</p>
                  </Tab>
                  <Tab key="upload" title="Upload Image">
                    <div className="flex flex-col items-center gap-4 py-4">
                      <input ref={fileInputRef} type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileUpload} className="hidden" />
                      <Button color="primary" variant="flat" startContent={<Upload size={20} />} onClick={() => fileInputRef.current?.click()}>
                        Choose Image File
                      </Button>
                      {uploadedImage && (
                        <div className="w-full max-w-md">
                          <div className="bg-gray-200 dark:bg-gray-400 rounded-lg p-4 flex justify-center items-center">
                            <img src={uploadedImage} alt="Uploaded signature" className="max-w-full max-h-[200px] object-contain" />
                          </div>
                        </div>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">Upload a PNG or JPG image of your signature</p>
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter>
                <Button onClick={clearSignature}>Cancel</Button>
                <Button color="primary" onClick={saveSignature}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SignModal;
