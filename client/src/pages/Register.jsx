import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { User, Mail, Lock, ArrowRight, UserCircle } from "lucide-react";

function Register({ setUserInfo }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("attendee");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUserInfo(data);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-[#F5F5F5] px-4 py-12">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
                        Create <span className="text-red-500">Account</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Join us and explore the best events</p>
                </div>

                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="pt-8 pb-4 text-center">
                        <CardTitle className="text-2xl font-black italic uppercase tracking-tight">Join Evently</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-red-500 transition-colors">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 h-11 rounded-xl bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-red-500 transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-11 rounded-xl bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-red-500 transition-colors">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 h-11 rounded-xl bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Account Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setRole("attendee")}
                                        className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                                            role === "attendee"
                                            ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-100"
                                            : "bg-gray-50 text-gray-500 border-transparent hover:border-red-200"
                                        }`}
                                    >
                                        Attendee
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRole("organizer")}
                                        className={`py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                                            role === "organizer"
                                            ? "bg-red-500 text-white border-red-500 shadow-md shadow-red-100"
                                            : "bg-gray-50 text-gray-500 border-transparent hover:border-red-200"
                                        }`}
                                    >
                                        Organizer
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-500 hover:bg-red-600 h-12 rounded-xl text-sm font-black italic uppercase tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 group mt-4"
                                disabled={loading}
                            >
                                {loading ? "Creating Account..." : (
                                    <>
                                        Get Started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-6 flex justify-center border-t">
                        <p className="text-sm font-bold text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-red-500 hover:underline font-black italic uppercase tracking-tighter">Login here</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default Register;
