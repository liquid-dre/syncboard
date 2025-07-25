import React from "react";

// Define the type for your component's props
interface LayoutProps {
	children: React.ReactNode; // This explicitly types the 'children' prop
}

const Layout = ({ children }: LayoutProps) => {
	return <div className="container mx-auto mt-5 px-4">{children}</div>;
};

export default Layout;
