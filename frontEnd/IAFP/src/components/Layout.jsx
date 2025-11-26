import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    // Check if we are on an auth page (login/signup) to decide whether to show sidebar
    // Or we can just use this Layout only for protected routes.
    // For now, I'll assume this Layout is used for pages that NEED the sidebar.

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
