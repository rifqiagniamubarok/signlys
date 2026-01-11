'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Button, Card, Spinner, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import SignModal from './SignModal';
import DropFile from './DropFile';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileX, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ButtonNigtmode from '../partial/ButtonNigtmode';
import dayjs from 'dayjs';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

interface Signature {
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  id: number;
  page: number;
  name: string;
}

const MobilePdfEditor: React.FC = () => {
  const { isOpen: isOpenSignModal, onOpen: onOpenSignModal, onOpenChange: onOpenChangeSignModal, onClose: onCloseSignModal } = useDisclosure();
  const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onOpenChange: onOpenChangeDrawer, onClose: onCloseDrawer } = useDisclosure();

  const [signatureImages, setSignatureImages] = useState<Signature[]>([]);
  const [signatureImageSelect, setSignatureImageSelect] = useState<Signature | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const pdfBytes = e.target?.result as ArrayBuffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true });
        setPdfData(pdfDataUri);
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setError(null);
    setIsLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    setIsLoading(false);
    setError(error.message);
  };

  const goToPrevPage = () => setPageNumber(Math.max(1, pageNumber - 1));
  const goToNextPage = () => setPageNumber(Math.min(numPages || 1, pageNumber + 1));

  const handleFileChange = (acceptedFiles: File[]) => {
    setIsLoading(true);
    setFile(acceptedFiles[0] || null);
    setPageNumber(1);
    setNumPages(null);
    setError(null);
  };

  const handleSaveSignature = (sign: string) => {
    const payload: Signature = {
      src: sign,
      x: 50,
      y: 50,
      width: 150,
      height: 75,
      id: Number(signatureImages.length),
      page: pageNumber,
      name: 'Sign ' + (signatureImages.length + 1),
    };
    setSignatureImages([...signatureImages, payload]);
    setSignatureImageSelect(payload);
    onCloseSignModal();
  };

  const addSignaturesToPdf = async () => {
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    try {
      const pdfBytes = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      for (const signature of signatureImages) {
        const imageBytes = await fetch(signature.src).then((res) => res.arrayBuffer());

        const isPng = signature.src.startsWith('data:image/png');
        const isJpeg = signature.src.startsWith('data:image/jpeg') || signature.src.startsWith('data:image/jpg');

        let image;
        if (isPng) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (isJpeg) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          image = await pdfDoc.embedPng(imageBytes);
        }

        const pages = pdfDoc.getPages();
        const page = pages[signature.page - 1];
        const { width, height } = page.getSize();

        page.drawImage(image, {
          x: signature.x,
          y: height - signature.height - signature.y,
          width: signature.width,
          height: signature.height,
        });
      }

      const modifiedPdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(modifiedPdfBytes)], { type: 'application/pdf' });
      const originalFileName = file.name.replace(/\.pdf$/, '');
      const editedFileName = `${originalFileName}-${dayjs(new Date()).format('YYYYMMDDHHmmss')}.pdf`;
      saveAs(blob, editedFileName);
    } catch (err) {
      console.error('Error editing and downloading PDF:', err);
      setError('Failed to edit and download PDF.');
    }
  };

  const handleDeleteFile = () => {
    setFile(null);
    setSignatureImageSelect(null);
    setSignatureImages([]);
  };

  const handleDeleteSignature = (signatureId: number) => {
    setSignatureImages(signatureImages.filter((sign) => sign.id !== signatureId));
    if (signatureImageSelect?.id === signatureId) {
      setSignatureImageSelect(null);
    }
  };

  const handleSignatureClick = (signature: Signature, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSignatureImageSelect(signature);
    onOpenDrawer();
  };

  const moveSignature = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (!signatureImageSelect) return;
    const step = 5;
    setSignatureImages(
      signatureImages.map((sig) => {
        if (sig.id === signatureImageSelect.id) {
          const updated = { ...sig };
          if (direction === 'up') updated.y -= step;
          if (direction === 'down') updated.y += step;
          if (direction === 'left') updated.x -= step;
          if (direction === 'right') updated.x += step;
          setSignatureImageSelect(updated);
          return updated;
        }
        return sig;
      })
    );
  };

  const resizeSignature = (action: 'increase' | 'decrease') => {
    if (!signatureImageSelect) return;
    const factor = action === 'increase' ? 1.1 : 0.9;
    setSignatureImages(
      signatureImages.map((sig) => {
        if (sig.id === signatureImageSelect.id) {
          const updated = {
            ...sig,
            width: sig.width * factor,
            height: sig.height * factor,
          };
          setSignatureImageSelect(updated);
          return updated;
        }
        return sig;
      })
    );
  };

  const currentPageSignatures = signatureImages.filter((sig) => sig.page === pageNumber);

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-dark-black flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-dark-gray shadow-sm">
        <div className="flex justify-between items-center p-3">
          <Button as={Link} href="/" size="sm" variant="light" isIconOnly>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg font-semibold text-black dark:text-white">PDF Editor</h1>
          <div className="flex gap-2">
            {file && (
              <Button size="sm" color="danger" variant="light" isIconOnly onClick={handleDeleteFile}>
                <FileX size={20} />
              </Button>
            )}
            <ButtonNigtmode />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {!file && !isLoading ? (
        <div className="flex-1 flex flex-col justify-center items-center p-4">
          <DropFile onDrop={handleFileChange} />
        </div>
      ) : isLoading ? (
        <div className="flex-1 flex justify-center items-center">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <>
          {/* PDF Viewer */}
          <div className="flex-1 overflow-auto bg-gray-200 dark:bg-dark-black">
            <div className="p-2">
              <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
                {error ? (
                  <div className="p-4 text-red-500 text-center">{`Error: ${error}`}</div>
                ) : (
                  <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
                    <Page pageNumber={pageNumber} width={window.innerWidth - 32} />
                  </Document>
                )}

                {/* Signatures overlay */}
                {currentPageSignatures.map((signature) => (
                  <div
                    key={signature.id}
                    onClick={(e) => handleSignatureClick(signature, e)}
                    style={{
                      position: 'absolute',
                      left: signature.x,
                      top: signature.y,
                      width: signature.width,
                      height: signature.height,
                      cursor: 'pointer',
                      border: signatureImageSelect?.id === signature.id ? '2px solid #0070f0' : '1px dashed #999',
                      borderRadius: '4px',
                      backgroundColor: signatureImageSelect?.id === signature.id ? 'rgba(0, 112, 240, 0.1)' : 'transparent',
                    }}
                  >
                    <img
                      src={signature.src}
                      alt={signature.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="bg-white dark:bg-dark-gray border-t border-gray-200 dark:border-gray-700 p-3 space-y-3">
            {/* Page Navigation */}
            <div className="flex justify-between items-center">
              <Button size="sm" onClick={goToPrevPage} isDisabled={pageNumber <= 1} color="primary" variant="flat">
                <ChevronLeft size={18} />
                Prev
              </Button>
              <span className="text-sm font-medium text-black dark:text-white">
                {pageNumber} / {numPages}
              </span>
              <Button size="sm" onClick={goToNextPage} isDisabled={pageNumber >= (numPages || 0)} color="primary" variant="flat">
                Next
                <ChevronRight size={18} />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button size="md" onClick={onOpenSignModal} color="primary" variant="solid" className="flex-1">
                <Plus size={18} />
                Add Signature
              </Button>
              <Button size="md" onClick={addSignaturesToPdf} color="success" variant="solid" className="flex-1" isDisabled={signatureImages.length === 0}>
                <Download size={18} />
                Save PDF
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Sign Modal */}
      <SignModal isOpen={isOpenSignModal} onOpenChange={onOpenChangeSignModal} onClose={onCloseSignModal} onSave={handleSaveSignature} />

      {/* Signature Editor Modal */}
      <Modal isOpen={isOpenDrawer} onOpenChange={onOpenChangeDrawer} placement="bottom" size="full">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Edit Signature</h3>
                {signatureImageSelect && <p className="text-sm text-gray-500">{signatureImageSelect.name}</p>}
              </ModalHeader>
              <ModalBody>
                {signatureImageSelect && (
                  <div className="space-y-4">
                    {/* Position Controls */}
                    <div>
                      <p className="text-sm font-medium mb-2">Position</p>
                      <div className="grid grid-cols-3 gap-2">
                        <div></div>
                        <Button size="sm" onClick={() => moveSignature('up')} variant="flat">
                          ↑
                        </Button>
                        <div></div>
                        <Button size="sm" onClick={() => moveSignature('left')} variant="flat">
                          ←
                        </Button>
                        <div></div>
                        <Button size="sm" onClick={() => moveSignature('right')} variant="flat">
                          →
                        </Button>
                        <div></div>
                        <Button size="sm" onClick={() => moveSignature('down')} variant="flat">
                          ↓
                        </Button>
                        <div></div>
                      </div>
                    </div>

                    {/* Size Controls */}
                    <div>
                      <p className="text-sm font-medium mb-2">Size</p>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => resizeSignature('decrease')} variant="flat" className="flex-1">
                          Smaller
                        </Button>
                        <Button size="sm" onClick={() => resizeSignature('increase')} variant="flat" className="flex-1">
                          Larger
                        </Button>
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      size="md"
                      color="danger"
                      variant="flat"
                      className="w-full"
                      onClick={() => {
                        if (signatureImageSelect) {
                          handleDeleteSignature(signatureImageSelect.id);
                          onClose();
                        }
                      }}
                      startContent={<Trash2 size={18} />}
                    >
                      Delete Signature
                    </Button>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="solid" onClick={onClose} className="w-full">
                  Done
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MobilePdfEditor;
