import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function template({ children }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center -mt-24">
      <div className="flex justify-center w-full p-4">{children}</div>
    </div>
  );
}
