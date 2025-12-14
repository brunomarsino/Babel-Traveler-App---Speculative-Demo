import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface SlideButtonProps {
  onConfirm: () => void;
  label: string;
  disabled?: boolean;
  colorClass?: string;
}

const SlideButton: React.FC<SlideButtonProps> = ({ 
  onConfirm, 
  label, 
  disabled = false,
  colorClass = 'bg-emerald-500' 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const maxDrag = useRef(0);

  useEffect(() => {
    if (containerRef.current) {
      // Width of container minus width of knob (48px approx) minus padding (8px)
      maxDrag.current = containerRef.current.clientWidth - 56;
    }
  }, []);

  const handleStart = (clientX: number) => {
    if (disabled || confirmed) return;
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || confirmed) return;
    
    // Calculate new position
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    let newPos = clientX - containerRect.left - 28; // Center anchor
    if (newPos < 0) newPos = 0;
    if (newPos > maxDrag.current) newPos = maxDrag.current;
    
    setPosition(newPos);
  };

  const handleEnd = () => {
    if (!isDragging || confirmed) return;
    setIsDragging(false);

    // Threshold to confirm (90%)
    if (position > maxDrag.current * 0.9) {
      setPosition(maxDrag.current);
      setConfirmed(true);
      onConfirm();
    } else {
      setPosition(0);
    }
  };

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleMove(e.clientX);
  const onMouseUp = () => handleEnd();
  const onMouseLeave = () => handleEnd();

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  const onTouchEnd = () => handleEnd();

  return (
    <div 
      className={`relative h-14 w-full rounded-full overflow-hidden select-none touch-none transition-opacity ${disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}`}
      style={{ backgroundColor: 'rgba(28, 25, 23, 0.05)' }} // Stone-900 with low opacity
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Track Background */}
      <div className="absolute inset-0 bg-stone-200" />
      
      {/* Progress Fill */}
      <div 
        className={`absolute top-0 left-0 h-full transition-all duration-75 ease-linear ${colorClass}`}
        style={{ width: `${(position / maxDrag.current) * 100 + 10}%`, opacity: position > 0 ? 1 : 0 }}
      />

      {/* Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className={`text-xs font-bold uppercase tracking-widest transition-opacity duration-300 ${confirmed ? 'opacity-0' : 'text-stone-500'} ${position > 20 ? 'opacity-20' : 'opacity-100'}`}>
            {label}
        </span>
      </div>

      {/* Success State */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 pointer-events-none ${confirmed ? 'opacity-100' : 'opacity-0'}`}>
         <span className="text-sm font-bold uppercase tracking-widest text-white flex items-center gap-2">
            <Check size={18} /> Confirmed
         </span>
      </div>

      {/* Knob */}
      <div 
        className={`absolute top-1 bottom-1 w-12 rounded-full shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform duration-75 ${confirmed ? 'scale-0' : 'scale-100 bg-white'}`}
        style={{ transform: `translateX(${position}px)`, marginLeft: '4px' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <ArrowRight size={20} className={colorClass.replace('bg-', 'text-')} />
      </div>
    </div>
  );
};

export default SlideButton;
