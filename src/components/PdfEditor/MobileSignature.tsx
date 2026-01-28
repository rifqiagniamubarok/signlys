import React, { useRef, useState, useCallback } from 'react';

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

interface MobileSignatureProps {
  signature: Signature;
  index: number;
  isSelected: boolean;
  onSelect: (signature: Signature) => void;
  onResize: (index: number, width: number, height: number) => void;
  onMove: (index: number, x: number, y: number) => void;
}

const MobileSignature: React.FC<MobileSignatureProps> = ({ signature, index, isSelected, onSelect, onResize, onMove }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio] = useState(signature.width / signature.height);
  const dragStartRef = useRef<{ x: number; y: number; startX: number; startY: number } | null>(null);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent, action: 'drag' | 'resize') => {
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];

      if (action === 'drag') {
        setIsDragging(true);
        dragStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          startX: signature.x,
          startY: signature.y,
        };
      } else {
        setIsResizing(true);
        resizeStartRef.current = {
          x: touch.clientX,
          y: touch.clientY,
          width: signature.width,
          height: signature.height,
        };
      }
    },
    [signature.x, signature.y, signature.width, signature.height],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];

      if (isDragging && dragStartRef.current) {
        const deltaX = touch.clientX - dragStartRef.current.x;
        const deltaY = touch.clientY - dragStartRef.current.y;

        const newX = Math.max(0, dragStartRef.current.startX + deltaX);
        const newY = Math.max(0, dragStartRef.current.startY + deltaY);

        onMove(index, newX, newY);
      } else if (isResizing && resizeStartRef.current) {
        const deltaX = touch.clientX - resizeStartRef.current.x;
        const deltaY = touch.clientY - resizeStartRef.current.y;

        const delta = Math.max(deltaX, deltaY);
        const scaleFactor = Math.max(0.3, 1 + delta / 100);

        const newWidth = Math.max(30, resizeStartRef.current.width * scaleFactor);
        const newHeight = newWidth / aspectRatio;

        onResize(index, newWidth, newHeight);
      }
    },
    [isDragging, isResizing, index, onMove, onResize, aspectRatio],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    dragStartRef.current = null;
    resizeStartRef.current = null;
  }, []);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, isResizing, handleTouchMove, handleTouchEnd]);

  return (
    <div
      style={{
        position: 'absolute',
        left: signature.x,
        top: signature.y,
        width: signature.width,
        height: signature.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        border: isSelected ? '3px solid #0070f0' : '2px dashed #999',
        borderRadius: '4px',
        backgroundColor: isSelected ? 'rgba(0, 112, 240, 0.1)' : 'transparent',
        touchAction: 'none',
        userSelect: 'none',
        zIndex: isSelected ? 10 : 1,
      }}
      onClick={() => onSelect(signature)}
      onTouchStart={(e) => handleTouchStart(e, 'drag')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelect(signature);
        }
      }}
      aria-label={`${signature.name} - tap to select, drag to move, use corner handles to resize`}
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

      {/* Resize handles - only show when selected */}
      {isSelected && (
        <>
          {/* Main resize handle - bottom right */}
          <div
            className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center"
            style={{ touchAction: 'none' }}
            onTouchStart={(e) => handleTouchStart(e, 'resize')}
          >
            <div className="w-3 h-3 border-r-2 border-b-2 border-white transform rotate-45"></div>
          </div>

          {/* Additional resize handles for better mobile UX */}
          <div
            className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 border border-white rounded-full shadow-lg opacity-80"
            style={{ touchAction: 'none' }}
            onTouchStart={(e) => handleTouchStart(e, 'resize')}
          />
          <div
            className="absolute -bottom-2 -left-2 w-6 h-6 bg-blue-500 border border-white rounded-full shadow-lg opacity-80"
            style={{ touchAction: 'none' }}
            onTouchStart={(e) => handleTouchStart(e, 'resize')}
          />
        </>
      )}

      {/* Visual feedback for dragging/resizing */}
      {(isDragging || isResizing) && <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-2 border-blue-500 border-dashed rounded"></div>}
    </div>
  );
};

export default MobileSignature;
