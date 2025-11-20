import React from 'react';

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 12L3.269 3.125A59.769 59.769 0 0121.94 2c.341 0 .666.017.981.05a4.5 4.5 0 014.528 4.528c.033.315.05.64.05.981v11.855c0 1.487-.338 2.92-.999 4.125m0 0a4.5 4.5 0 01-8.998-6m0 0a4.5 4.5 0 018.998 6m-9 0h9"
    />
  </svg>
);

export default SendIcon;
