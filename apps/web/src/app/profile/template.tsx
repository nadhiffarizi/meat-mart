import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function template({ children }: Props) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex justify-center w-full p-4 ">{children}</div>
    </div>
  );
}
