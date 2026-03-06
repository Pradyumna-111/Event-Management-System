import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search, MapPin, Menu, X, LogOut, User as UserIcon, Ticket, PlusCircle, Shield, LayoutDashboard } from "lucide-react";
import { useState } from "react";

function Navbar({ userInfo, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };

    const role = userInfo?.user?.role || userInfo?.role;
    const name = userInfo?.user?.name || userInfo?.name;

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-[#333545] text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    {/* Logo & Search */}
                    <div className="flex items-center gap-8 flex-1">
                        <Link to="/" className="flex-shrink-0">
                            <span className="text-2xl font-black tracking-tighter text-white">EVENT<span className="text-red-500">LY</span></span>
                        </Link>

                        <div className="hidden md:block flex-1 max-w-xl relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                            <Input
                                type="text"
                                placeholder="Search for Events, Plays, Sports and Activities"
                                className="w-full bg-white/10 border-none text-white placeholder:text-gray-400 pl-10 h-10 rounded-md focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-red-400 transition-colors text-sm font-medium">
                            <MapPin className="h-4 w-4" />
                            <span>Select Location</span>
                        </div>

                        {!userInfo ? (
                            <div className="flex items-center gap-3">
                                <Link to="/login">
                                    <Button variant="ghost" className="text-white hover:text-red-500 hover:bg-white/10 font-bold">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="bg-red-500 hover:bg-red-600 text-white font-bold px-6">Register</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                {role === "participant" && (
                                    <Link to="/my-tickets">
                                        <Button variant="ghost" size="sm" className="text-white hover:text-red-500 gap-2">
                                            <Ticket className="h-4 w-4" /> My Tickets
                                        </Button>
                                    </Link>
                                )}
                                {role === "organizer" && (
                                    <Link to="/dashboard">
                                        <Button variant="ghost" size="sm" className="text-white hover:text-red-500 gap-2">
                                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                                        </Button>
                                    </Link>
                                )}
                                {role === "admin" && (
                                    <Link to="/admin-panel">
                                        <Button variant="ghost" size="sm" className="text-white hover:text-red-500 gap-2">
                                            <Shield className="h-4 w-4" /> Admin
                                        </Button>
                                    </Link>
                                )}

                                <Link to="/profile" className="flex items-center gap-2 group">
                                    <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-red-500 transition-all">
                                        <AvatarFallback className="bg-red-500 text-white font-bold">
                                            {name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </Link>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="text-white hover:text-red-500 hover:bg-white/10"
                                >
                                    <LogOut className="h-5 w-5" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-[#2b2d3d] border-t border-white/5 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <div className="p-2 relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input placeholder="Search events..." className="bg-white/10 border-none text-white pl-10" />
                        </div>
                        {!userInfo ? (
                            <>
                                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Login</Link>
                                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-red-500" onClick={() => setIsMenuOpen(false)}>Register</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                                {role === "participant" && (
                                    <Link to="/my-tickets" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>My Tickets</Link>
                                )}
                                {role === "organizer" && (
                                    <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                                )}
                                {role === "admin" && (
                                    <Link to="/admin-panel" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-white/5" onClick={() => setIsMenuOpen(false)}>Admin Panel</Link>
                                )}
                                <button onClick={handleLogout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-white/5">Logout</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
