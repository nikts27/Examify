// eslint-disable-next-line no-unused-vars
import React from "react";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet.jsx";
import {Button} from "@/components/ui/button.jsx";
import Sidebar from "./Sidebar.jsx";
import {PersonIcon, HamburgerMenuIcon} from "@radix-ui/react-icons";
import {useSelector} from "react-redux";

const Navbar = () => {
    const {auth} = useSelector(store=>store);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className='flex items-center gap-4'>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="rounded-lg hover:bg-gray-100"
                                >
                                    <HamburgerMenuIcon className="h-5 w-5 text-gray-600"/>
                                </Button>
                            </SheetTrigger>
                            <SheetContent 
                                className="w-80 border-r-0 bg-white" 
                                side="left"
                            >
                                <SheetHeader className="border-b pb-4">
                                    <SheetTitle>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                                Examify
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-full bg-gray-100">
                                                    <PersonIcon className="h-6 w-6 text-gray-600"/>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-gray-900">
                                                        {auth.user?.fullName}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {auth.user?.username}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </SheetTitle>
                                </SheetHeader>
                                <Sidebar/>
                            </SheetContent>
                        </Sheet>
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                                Examify
                            </span>
                            <span className="ml-2 text-sm text-gray-500 hidden sm:inline">
                                University Exam Portal
                            </span>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="p-1 rounded-full bg-white">
                                <PersonIcon className="h-4 w-4 text-gray-600"/>
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                                {auth.user?.fullName}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;