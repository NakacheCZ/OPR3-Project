import React from 'react';
import Header from './Header';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    username?: string;
}

export default function Layout({ children, title, username }: LayoutProps) {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center px-4">
            <Header title={title} username={username} />
            <main className="flex-grow flex flex-col items-center justify-center w-full">
                {children}
            </main>
        </div>
    );
}
