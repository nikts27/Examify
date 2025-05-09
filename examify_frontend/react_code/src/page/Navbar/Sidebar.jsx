// eslint-disable-next-line no-unused-vars
import React from "react";
import {HomeIcon, CalendarIcon, ExitIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button.jsx";
import {SheetClose} from "@/components/ui/sheet.jsx";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {logout} from "@/State/Auth/Action.js";

const menu = [
    {
        name: "Home",
        path: "/home",
        icon: <HomeIcon className="h-5 w-5"/>,
        description: "Dashboard overview"
    },
    {
        name: "Calendar",
        path: "/calendar",
        icon: <CalendarIcon className="h-5 w-5"/>,
        description: "View and manage exams"
    },
    {
        name: "Logout",
        path: "/signin",
        icon: <ExitIcon className="h-5 w-5"/>,
        description: "Sign out of your account"
    }
];

const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="p-4 space-y-2">
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 px-4 mb-2">Menu</h2>
                <div className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 mb-4"/>
            </div>
            {menu.map((item) => (
                <div key={item.name} className="px-2">
                    <SheetClose asChild>
                        <Button
                            variant="ghost"
                            className={`w-full flex items-center justify-start gap-4 p-3 rounded-lg transition-all duration-200
                                ${item.name === "Logout" 
                                    ? "hover:bg-red-100 hover:text-red-600" 
                                    : "hover:bg-indigo-100 hover:text-indigo-600"}`}
                            onClick={() => {
                                navigate(item.path);
                                if (item.name === "Logout") {
                                    handleLogout();
                                }
                            }}
                        >
                            <div className={`p-2 rounded-md 
                                ${item.name === "Logout" 
                                    ? "bg-red-100 text-red-600" 
                                    : "bg-indigo-100 text-indigo-600"}`}>
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-xs text-gray-500">{item.description}</span>
                            </div>
                        </Button>
                    </SheetClose>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;