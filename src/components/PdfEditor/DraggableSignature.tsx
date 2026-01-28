import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useDrag } from 'react-dnd';
import classNames from 'classnames';

const ItemTypes = {
  SIGNATURE: 'signature',
};

interface DraggableSignatureProps {
  src: string;
  position: { x: number; y: number };
  width?: number;
  height?: number;
  index: number;
  onDrop: (index: number, position: { x: number; y: number }) => void;
  onResize?: (index: number, width: number, height: number) => void;
  isSelected?: boolean;
  onClick: () => void;
}

const DraggableSignature: React.FC<DraggableSignatureProps> = ({ src, position, width = 100, height = 50, index, onDrop, onResize, isSelected = false, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio] = useState(width / height);
  const resizeStartRef = useRef<{ x: number; y: number; width: number; height: number } | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SIGNATURE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isResizing,
  });

  useEffect(() => {
    drag(ref);
  }, [drag]);

  const handleResizeStart = useCallback( 
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      e.preventDefault();

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      setIsResizing(true);
      resizeStartRef.current = {
        x: clientX,
        y: clientY,
        width,
        height,
      };

      const handleMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        if (!resizeStartRef.current || !onResize) return;

        const moveClientX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const moveClientY = 'touches' in moveEvent ? moveEvent.touches[0].clientY : moveEvent.clientY;

        const deltaX = moveClientX - resizeStartRef.current.x;
        const deltaY = moveClientY - resizeStartRef.current.y;

        // Use the larger delta to maintain aspect ratio
        const delta = Math.max(deltaX, deltaY);
        const scaleFactor = Math.max(0.2, 1 + delta / 100);

        const newWidth = resizeStartRef.current.width * scaleFactor;
        const newHeight = newWidth / aspectRatio;

        // Ensure minimum size
        const minSize = 20;
        const finalWidth = Math.max(minSize, newWidth);
        const finalHeight = Math.max(minSize / aspectRatio, newHeight);

        onResize(index, finalWidth, finalHeight);
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeStartRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove as unknown as (event: TouchEvent) => void);
        document.removeEventListener('touchend', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove as (event: TouchEvent) => void, { passive: false });
      document.addEventListener('touchend', handleMouseUp);
    },
    [index, onResize, width, height, aspectRatio],
  );

  useEffect(() => {
    if (isDragging) {
      // Handle dragging logic here
    }
  }, [isDragging]);

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width,
        height,
        opacity: isDragging ? 0.5 : 1,
        cursor: isResizing ? 'nw-resize' : 'move',
        userSelect: 'none',
      }}
      className={classNames('group', isSelected && 'ring-2 ring-blue-500 ring-opacity-75', 'hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50')}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`Signature - drag to move, use corner handle to resize`}
    >
      <img
        src={src}
        alt="Signature"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
        }}
      />

      {/* Resize Handle - Bottom Right Corner */}
      {isSelected && (
        <div
          className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize shadow-lg opacity-90 hover:opacity-100 hover:scale-110 transition-all flex items-center justify-center"
          style={{
            touchAction: 'none',
          }}
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          title="Drag to resize (maintains aspect ratio)"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              // Could trigger resize mode here
            }
          }}
          aria-label="Resize handle - drag to resize signature"
        >
          <div className="w-2 h-2 border-r-2 border-b-2 border-white transform rotate-45"></div>
        </div>
      )}

      {/* Mobile-friendly resize handles on all corners when selected */}
      {isSelected && (
        <>
          {/* Top Left */}
          <div
            className="absolute -top-1 -left-1 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nw-resize shadow-lg opacity-80 lg:hidden"
            style={{ touchAction: 'none' }}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          />
          {/* Top Right */}
          <div
            className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nw-resize shadow-lg opacity-80 lg:hidden"
            style={{ touchAction: 'none' }}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          />
          {/* Bottom Left */}
          <div
            className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-500 border border-white rounded-full cursor-nw-resize shadow-lg opacity-80 lg:hidden"
            style={{ touchAction: 'none' }}
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
          />
        </>
      )}
    </div>
  );
};

export default DraggableSignature;
