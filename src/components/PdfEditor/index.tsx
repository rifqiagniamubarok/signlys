'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { Button, Spinner, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import DraggableSignature from './DraggableSignature';
import MobileSignature from './MobileSignature';
import SidebarEditor from './SidebarEditor';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import SignModal from './SignModal';
import DropFile from './DropFile';
import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileX, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import ButtonNigtmode from '../partial/ButtonNigtmode';
import dayjs from 'dayjs';

// Set the worker URL to the correct path
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs';

const ItemTypes = {
  SIGNATURE: 'signature',
};

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

interface DropAreaProps {
  children: React.ReactNode;
  onDrop: (index: number, offset: { x: number; y: number }) => void;
}

const DropArea: React.FC<DropAreaProps> = ({ children, onDrop }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.SIGNATURE,
    drop: (item: { index: number }, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        onDrop(item.index, offset);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = canDrop && isOver;

  return (
    <div
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      style={{
        width: '100%',
        position: 'relative',
      }}
      className="bg-white drop-area border h-fit"
    >
      {children}
    </div>
  );
};

const PdfEditor: React.FC = () => {
  const { isOpen: isOpenSE, onOpen: onOpenSE, onOpenChange: onOpenChangeSE, onClose: onCloseSE } = useDisclosure();
  const { isOpen: isOpenMobileEdit, onOpen: onOpenMobileEdit, onOpenChange: onOpenChangeMobileEdit } = useDisclosure();
  const [signatureImages, setSignatureImages] = useState<Signature[]>([]);
  const [signatureImageSelect, setSignatureImageSelect] = useState<Signature | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [file, setFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const goToPrevPage = () => setPageNumber(pageNumber - 1);
  const goToNextPage = () => setPageNumber(pageNumber + 1);

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
      x: 0,
      y: 0,
      width: 100,
      height: 50,
      id: Number(signatureImages.length),
      page: pageNumber,
      name: 'sign ' + (signatureImages.length + 1),
    };
    setSignatureImages([...signatureImages, payload]);
    setSignatureImageSelect(payload);
    onCloseSE();
  };

  const handleDrop = (index: number, offset: { x: number; y: number }) => {
    const dropArea = document.querySelector('.drop-area');
    const dropAreaRect = dropArea?.getBoundingClientRect();
    if (!dropAreaRect) return;

    const x = offset.x - dropAreaRect.left;
    const y = offset.y - dropAreaRect.top;

    setSignatureImages((prevSignatures) => prevSignatures.map((signature, i) => (i === index ? { ...signature, x, y, page: pageNumber } : signature)));
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

        // Detect image type from the data URL
        const isPng = signature.src.startsWith('data:image/png');
        const isJpeg = signature.src.startsWith('data:image/jpeg') || signature.src.startsWith('data:image/jpg');

        let image;
        if (isPng) {
          image = await pdfDoc.embedPng(imageBytes);
        } else if (isJpeg) {
          image = await pdfDoc.embedJpg(imageBytes);
        } else {
          // Default to PNG for canvas-drawn signatures
          image = await pdfDoc.embedPng(imageBytes);
        }

        const pages = pdfDoc.getPages();
        const page = pages[signature.page - 1];
        const { height } = page.getSize();

        page.drawImage(image, {
          x: signature.x,
          y: height - 50 - signature.y,
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

  const handleMovePage = (page: number) => {
    setPageNumber(page);
  };

  const handleSelectSignature = (sign: Signature) => {
    setSignatureImageSelect(sign);
    setPageNumber(sign.page);
  };

  const handleDuplicteToCurrentPage = (signature: Signature) => {
    setSignatureImages([...signatureImages, { ...signature, id: Number(signatureImages.length), page: pageNumber }]);
  };

  const handleDeleteSignature = (signature: Signature) => {
    setSignatureImages(signatureImages.filter((sign) => sign.id !== signature.id));
  };

  const sortSignatures = () => {
    setSignatureImages([...signatureImages].sort((a, b) => a.id - b.id));
  };

  const handleSyncSelectSignature = (signature: Signature) => {
    const filteredSignature = signatureImages.filter((sign) => sign.id !== signature.id);
    setSignatureImages([...filteredSignature, signature]);
  };

  const handleResize = (index: number, newWidth: number, newHeight: number) => {
    setSignatureImages((prevSignatures) => prevSignatures.map((signature, i) => (i === index ? { ...signature, width: newWidth, height: newHeight } : signature)));
  };

  const handleDuplicatToAllPage = (signature: Signature) => {
    const newSignatures = [...signatureImages];
    for (let i = 1; i <= (numPages || 0); i++) {
      if (i !== signature.page) {
        const payload = { ...signature };
        payload.id = Number(newSignatures.length);
        payload.page = Number(i);
        newSignatures.push(payload);
      }
    }
    setSignatureImages(newSignatures);
  };

  const handleDeleteFile = () => {
    setFile(null);
    setSignatureImageSelect(null);
    setSignatureImages([]);
  };

  const handleSignatureClick = (signature: Signature, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSignatureImageSelect(signature);
    if (isMobile) {
      onOpenMobileEdit();
    }
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
      }),
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
      }),
    );
  };

  const sizeSignature = [
    {
      name: 'sm',
      width: 50,
      height: 25,
    },
    {
      name: 'md',
      width: 100,
      height: 50,
    },
    {
      name: 'lg',
      width: 200,
      height: 100,
    },
    {
      name: 'xl',
      width: 400,
      height: 200,
    },
  ];

  return (
    <div className="w-screen h-screen bg-gray-100 dark:bg-dark-black flex flex-col lg:bg-slate-200">
      {!file && !isLoading && (
        <div className="h-screen w-screen flex justify-center items-center bg-primary">
          <div className="flex flex-col items-center gap-4 px-4">
            <DropFile onDrop={handleFileChange} />
            <Button as={Link} href="/" variant="light" className="text-white" size={isMobile ? 'sm' : 'md'}>
              <ArrowLeft />
              Back
            </Button>
          </div>
        </div>
      )}
      {isLoading && (
        <div className="fixed inset-0 z-50 w-screen h-screen flex justify-center items-center bg-white dark:bg-dark-gray">
          <Spinner color="primary" size="lg" />
        </div>
      )}
      <SignModal isOpen={isOpenSE} onOpenChange={onOpenChangeSE} onClose={onCloseSE} onSave={handleSaveSignature} />

      {file && (
        <>
          {/* Mobile/Tablet View */}
          {isMobile ? (
            <div className="flex flex-col h-screen">
              {/* Header */}
              <div className="sticky top-0 z-50 bg-white dark:bg-dark-gray shadow-sm">
                <div className="flex justify-between items-center p-3">
                  <Button as={Link} href="/" size="sm" variant="light" isIconOnly>
                    <ArrowLeft size={20} />
                  </Button>
                  <h1 className="text-base font-semibold text-black dark:text-white">PDF Editor</h1>
                  <div className="flex gap-2">
                    <Button size="sm" color="danger" variant="light" isIconOnly onClick={handleDeleteFile}>
                      <FileX size={20} />
                    </Button>
                    <ButtonNigtmode />
                  </div>
                </div>
              </div>

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
                    {signatureImages
                      .filter((sig) => sig.page === pageNumber)
                      .map((signature) => (
                        <MobileSignature
                          key={signature.id}
                          signature={signature}
                          index={signatureImages.indexOf(signature)}
                          isSelected={signatureImageSelect?.id === signature.id}
                          onSelect={(sig) => handleSignatureClick(sig, {} as React.MouseEvent<HTMLDivElement>)}
                          onResize={handleResize}
                          onMove={(index, newX, newY) => {
                            setSignatureImages((prev) => prev.map((sig, i) => (i === index ? { ...sig, x: newX, y: newY } : sig)));
                          }}
                        />
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
                  <Button size="md" onClick={onOpenSE} color="primary" variant="solid" className="flex-1">
                    <Plus size={18} />
                    Add
                  </Button>
                  <Button size="md" onClick={addSignaturesToPdf} color="success" variant="solid" className="flex-1" isDisabled={signatureImages.length === 0}>
                    <Download size={18} />
                    Save PDF
                  </Button>
                </div>
              </div>

              {/* Mobile Signature Editor Modal */}
              <Modal isOpen={isOpenMobileEdit} onOpenChange={onOpenChangeMobileEdit} placement="bottom" size="full">
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
                            {/* Instruction */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <p className="text-xs text-blue-600 dark:text-blue-400">
                                💡 <strong>Tip:</strong> You can drag the signature to move it, or use the blue handles on the signature to resize it directly on the PDF!
                              </p>
                            </div>

                            {/* Position Controls */}
                            <div>
                              <p className="text-sm font-medium mb-2 dark:text-white">Fine Position Adjustment</p>
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
                              <p className="text-sm font-medium mb-2 dark:text-white">Fine Size Adjustment</p>
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
                                  handleDeleteSignature(signatureImageSelect);
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
          ) : (
            /* Desktop View */
            <div className="flex h-screen">
              <div className="grow">
                <div className="h-screen overflow-y-auto">
                  <div className="sticky top-0 z-50 p-4 bg-white dark:bg-dark-gray">
                    <div className="flex w-full justify-between">
                      <div className="space-x-2">
                        <Button onClick={onOpenSE} isDisabled={!file} color="primary">
                          Add Signature
                        </Button>
                        <Button onClick={addSignaturesToPdf} isDisabled={!file} color="primary" variant="solid">
                          Save
                        </Button>
                      </div>
                      <div className="space-x-2">
                        <Button color="danger" isIconOnly variant="faded" onClick={handleDeleteFile}>
                          <FileX />
                        </Button>
                        <ButtonNigtmode />
                      </div>
                    </div>
                  </div>
                  <div className="dark:bg-dark-black bg-gray-200 text-white px-2 pt-2 pb-4 space-y-2">
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <Button onClick={goToPrevPage} isDisabled={pageNumber <= 1 || !file} color="primary" size="sm">
                          Prev
                        </Button>
                      </div>
                      <div className="text-primary">
                        {pageNumber} / {numPages}
                      </div>
                      <div>
                        <Button onClick={goToNextPage} isDisabled={pageNumber >= (numPages || 0) || !file} color="primary" size="sm">
                          Next
                        </Button>
                      </div>
                    </div>
                    <div className="w-full flex justify-center">
                      <div className="min-h-screen w-fit drop-area">
                        <DndProvider backend={HTML5Backend}>
                          <DropArea onDrop={handleDrop}>
                            {file && (
                              <div className="relative w-full h-full">
                                {error ? (
                                  <div className="text-red-500">{`Error loading PDF: ${error}`}</div>
                                ) : (
                                  <Document file={pdfData} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
                                    <Page pageNumber={pageNumber} />
                                  </Document>
                                )}
                                {signatureImages.map((signature, index) => {
                                  if (signature.page !== pageNumber) return null;
                                  return (
                                    <DraggableSignature
                                      key={index}
                                      isSelected={signatureImageSelect?.id == signature?.id}
                                      src={signature.src}
                                      position={{ x: signature.x, y: signature.y }}
                                      index={index}
                                      onDrop={handleDrop}
                                      onResize={handleResize}
                                      onClick={() => setSignatureImageSelect(signature)}
                                      width={signature.width}
                                      height={signature.height}
                                    />
                                  );
                                })}
                              </div>
                            )}
                          </DropArea>
                        </DndProvider>
                      </div>
                    </div>
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <Button onClick={goToPrevPage} isDisabled={pageNumber <= 1 || !file} color="primary" size="sm">
                          Prev
                        </Button>
                      </div>
                      <div className="text-primary">
                        {pageNumber} / {numPages}
                      </div>
                      <div>
                        <Button onClick={goToNextPage} isDisabled={pageNumber >= (numPages || 0) || !file} color="primary" size="sm">
                          Next
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grow-0 w-[400px] h-screen max-h-screen overflow-y-auto">
                <SidebarEditor
                  signatureImageSelect={signatureImageSelect}
                  sizeSignature={sizeSignature}
                  numPages={numPages}
                  pageNumber={pageNumber}
                  signatureImages={signatureImages}
                  handleDuplicatToAllPage={handleDuplicatToAllPage}
                  handleDeleteSignature={handleDeleteSignature}
                  setSignatureImageSelect={setSignatureImageSelect}
                  handleSyncSelectSignature={handleSyncSelectSignature}
                  handleMovePage={handleMovePage}
                  handleSelectSignature={handleSelectSignature}
                  handleDuplicteToCurrentPage={handleDuplicteToCurrentPage}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PdfEditor;
