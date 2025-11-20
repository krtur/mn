import React from 'react';

const LightBulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}>
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-11.62A6.01 6.01 0 0012 1.125a6.01 6.01 0 00-1.5 11.62v5.25m1.5-1.5a1.5 1.5 0 00-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-3m3 0a1.5 1.5 0 00-1.5-1.5m1.5 1.5a1.5 1.5 0 00-1.5-1.5m-3 0a1.5 1.5 0 00-3 0m3 0a1.5 1.5 0 00-3 0m3 0h-3m3 0a1.5 1.5 0 00-1.5-1.5m1.5 1.5a1.5 1.5 0 00-1.5-1.5m3 1.5a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75M12 18v-1.5m0-1.5a3 3 0 01-3-3H6a6 6 0 016-6v6a3 3 0 01-3 3h-3" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M9 12.75h6m-6 3h6m-6-3a3 3 0 10-3 3h3a3 3 0 00-3-3z" 
        />
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 3v1.5M12 21v-1.5m-6.364-2.136l1.06-1.06M17.32 8.68l1.06-1.06M5.68 8.68l-1.06-1.06m12.72 12.72l-1.06-1.06M12 6a6 6 0 100 12 6 6 0 000-12z" 
        />
    </svg>
);

export default LightBulbIcon;