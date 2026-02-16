import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

function Login({ setUserInfo }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("userInfo", JSON.stringify(data));
            setUserInfo(data);
            navigate("/");
        } catch (err) {
            alert(err.response?.data?.message || "Invalid Email or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center bg-[#F5F5F5] px-4 py-12">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900 mb-2">
                        Welcome <span className="text-red-500">Back</span>
                    </h1>
                    <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Enter your credentials to access your account</p>
                </div>

                <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-white">
                    <CardHeader className="pt-8 pb-4 text-center">
                        <CardTitle className="text-2xl font-black italic uppercase tracking-tight">Login to Your Account</CardTitle>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-red-500 transition-colors">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-focus-within:text-red-500 transition-colors">Password</label>
                                    <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:underline">Forgot Password?</Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10 h-12 rounded-xl bg-gray-50 border-none focus-visible:ring-1 focus-visible:ring-red-500 transition-all"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-red-500 hover:bg-red-600 h-12 rounded-xl text-sm font-black italic uppercase tracking-widest transition-all shadow-lg shadow-red-100 flex items-center justify-center gap-2 group"
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : (
                                    <>
                                        Sign In <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="bg-gray-50 p-6 flex justify-center border-t">
                        <p className="text-sm font-bold text-gray-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-red-500 hover:underline font-black italic uppercase tracking-tighter">Register now</Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default Login;
