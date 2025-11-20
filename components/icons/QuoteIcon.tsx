import React from 'react';

const QuoteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="currentColor" 
        viewBox="0 0 24 24" 
        {...props}>
        <path d="M14.017 21v-7.391c0-2.908 1.697-4.285 3.983-4.285 2.286 0 3.983 1.848 3.983 4.169 0 3.31-1.983 6.44-4.983 7.507l-1-.999zm-14.017 0v-7.391c0-2.908 1.697-4.285 3.983-4.285 2.286 0 3.983 1.848 3.983 4.169 0 3.31-1.983 6.44-4.983 7.507l-1-.999z" />
    </svg>
);

export default QuoteIcon;
