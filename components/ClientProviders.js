"use client";

import { useEffect, useState } from 'react';
import { CartProvider } from './CartContext';

export default function ClientProviders({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // On the server and during initial hydration, render children without CartProvider
    // This prevents any localStorage access on the server
    if (!mounted) {
        return <>{children}</>;
    }

    return <CartProvider>{children}</CartProvider>;
}
