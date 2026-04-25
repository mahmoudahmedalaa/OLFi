import React from 'react';

// Tabby Logo (Text based style)
export const LogoTabby = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontFamily="sans-serif" fontWeight="900" fontSize="32" letterSpacing="-1">tabby</text>
    </svg>
);

// Tamara Logo
export const LogoTamara = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fill="#FF8D6D" fontFamily="serif" fontWeight="800" fontSize="34" letterSpacing="-1.5">tamara</text>
    </svg>
);

// Careem Logo (Green Circle + White smile/C)
export const LogoCareem = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="50" fill="#47A23F" />
        <path d="M70 40 Q 50 65 30 40" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M75 50 Q 50 85 25 50" stroke="white" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// e& (Etisalat)
export const LogoEtisalat = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#E3000F" fontFamily="sans-serif" fontWeight="900" fontSize="48" letterSpacing="-2">e&</text>
    </svg>
);

// DEWA (Dubai Electricity and Water Authority)
export const LogoDEWA = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="45" stroke="#E3000F" strokeWidth="4" />
        <circle cx="50" cy="50" r="35" stroke="#47A23F" strokeWidth="4" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="currentColor" fontFamily="sans-serif" fontWeight="800" fontSize="22" letterSpacing="1">DEWA</text>
    </svg>
);

// Noon (Yellow Circle + Black Text)
export const LogoNoon = ({ className = '' }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="50" cy="50" r="50" fill="#FEEA00" />
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#000000" fontFamily="sans-serif" fontWeight="900" fontSize="32" letterSpacing="0">noon</text>
    </svg>
);
