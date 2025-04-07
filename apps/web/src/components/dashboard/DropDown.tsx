'use client';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IHtmlDropdown {
  children: React.ReactNode;
  buttonLabel: string;
}

function Dropdown({ children, buttonLabel }: IHtmlDropdown) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState('0px');

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : '0px');
    }
  }, [isOpen]);

  return (
    <div>
      {' '}
      <button
        className=" flex justify-between items-center w-full py-2 px-4 rounded-t-md bg-red-200"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{buttonLabel}</span>
        <span>{isOpen ? <ChevronUp /> : <ChevronDown />}</span>
      </button>
      <div
        ref={contentRef}
        style={{ height }}
        className="transition-all duration-300 ease-in-out overflow-hidden"
      >
        <div className="py-8 px-10 bg-blue-200 rounded-b-md">{children}</div>
      </div>
    </div>
  );
}

export default Dropdown;
