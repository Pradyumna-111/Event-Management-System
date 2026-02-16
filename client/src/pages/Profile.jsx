import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { User, Ticket, Settings, Mail, Phone, Calendar, Shield, MapPin, Edit3, Lock, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../components/ui/dialog";

function Profile({ userInfo }) {
    const [user, setUser] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);

    const [editData, setEditData] = useState({ name: "", bio: "", phone: "" });
    const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo) {
            navigate("/login");
            return;
        }

        const fetchProfileData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const userRes = await axios.get("http://localhost:5000/api/user/profile", config);
                setUser(userRes.data);
                setEditData({ name: userRes.data.name, bio: userRes.data.bio || "", phone: userRes.data.phone || "" });

                const ticketsRes = await axios.get(`http://localhost:5000/api/tickets/user/${userRes.data._id}`, config);
                setTickets(ticketsRes.data);
            } catch (err) {
                console.error("Error fetching profile data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate, userInfo]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            const { data } = await axios.put("http://localhost:5000/api/user/profile", editData, config);
            setUser(data);
            setIsEditing(false);
            alert("✅ Profile updated successfully!");
        } catch (err) {
            console.error("Error updating profile", err);
            alert("❌ Failed to update profile");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("❌ New passwords do not match!");
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.put("http://localhost:5000/api/user/password", {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, config);
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            alert("✅ Password updated successfully!");
        } catch (err) {
            console.error("Error changing password", err);
            alert(err.response?.data?.message || "❌ Failed to change password");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("ARE YOU ABSOLUTELY SURE? This action is permanent and cannot be undone.")) {
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                await axios.delete("http://localhost:5000/api/user", config);
                localStorage.removeItem("userInfo");
                alert("Account deleted. We're sorry to see you go.");
                window.location.href = "/";
            } catch (err) {
                console.error("Error deleting account", err);
                alert("❌ Failed to delete account");
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
             <div className="animate-spin h-12 w-12 border-4 border-red-500 border-t-transparent rounded-full"></div>
        </div>
    );
    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border mb-8 flex flex-col md:flex-row items-center gap-8">
                    <Avatar className="h-32 w-32 border-4 border-red-50 shadow-lg">
                        <AvatarFallback className="bg-red-500 text-white text-4xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left flex-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">{user.name}</h1>
                            <Badge className="bg-red-500 hover:bg-red-600 uppercase text-[10px] tracking-widest px-3 border-none">
                                {user.role}
                            </Badge>
                        </div>
                        <p className="text-gray-500 text-lg mb-4">{user.email}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-full border">
                                <Calendar className="h-4 w-4 text-red-500" />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 px-3 py-1.5 rounded-full border">
                                <Ticket className="h-4 w-4 text-red-500" />
                                <span>{tickets.length} Tickets Booked</span>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="rounded-xl border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all px-8 h-12 font-bold" onClick={() => navigate("/")}>
                        Back to Events
                    </Button>
                </div>

                {/* Tabs Section */}
                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="bg-white border p-1 rounded-2xl h-auto mb-8 shadow-sm flex flex-wrap justify-start">
                        <TabsTrigger value="info" className="rounded-xl py-3 px-8 data-[state=active]:bg-red-500 data-[state=active]:text-white font-bold transition-all">
                            <User className="h-4 w-4 mr-2" />
                            Personal Info
                        </TabsTrigger>
                        <TabsTrigger value="tickets" className="rounded-xl py-3 px-8 data-[state=active]:bg-red-500 data-[state=active]:text-white font-bold transition-all">
                            <Ticket className="h-4 w-4 mr-2" />
                            My Tickets
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="rounded-xl py-3 px-8 data-[state=active]:bg-red-500 data-[state=active]:text-white font-bold transition-all">
                            <Settings className="h-4 w-4 mr-2" />
                            Account Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="info" className="animate-in fade-in duration-500">
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white border-b p-8 flex flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="text-2xl font-black uppercase italic tracking-tight text-gray-900">Personal Information</CardTitle>
                                    <CardDescription>View and manage your account details</CardDescription>
                                </div>
                                <Dialog open={isEditing} onOpenChange={setIsEditing}>
                                    <DialogTrigger asChild>
                                        <Button className="bg-gray-900 hover:bg-black rounded-xl gap-2">
                                            <Edit3 className="h-4 w-4" /> Edit Profile
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="rounded-3xl border-none shadow-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Edit Profile</DialogTitle>
                                            <DialogDescription>Make changes to your profile information here.</DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdateProfile} className="space-y-6 py-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Full Name</label>
                                                <Input
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                                                    className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Phone Number</label>
                                                <Input
                                                    value={editData.phone}
                                                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                                    className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-gray-400">Bio</label>
                                                <textarea
                                                    value={editData.bio}
                                                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                                                    className="w-full rounded-xl border-gray-100 bg-gray-50 p-3 text-sm focus:bg-white focus:outline-none ring-offset-background focus-visible:ring-1 focus-visible:ring-ring"
                                                    rows={4}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 rounded-xl h-12 font-black italic uppercase tracking-widest">Save Changes</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-red-500 transition-colors">
                                        <User className="h-3 w-3" /> Full Name
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">{user.name}</p>
                                </div>
                                <div className="space-y-2 group">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-red-500 transition-colors">
                                        <Mail className="h-3 w-3" /> Email Address
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">{user.email}</p>
                                </div>
                                <div className="space-y-2 group">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-red-500 transition-colors">
                                        <Phone className="h-3 w-3" /> Phone Number
                                    </p>
                                    <p className="text-xl font-bold text-gray-800">{user.phone || "Not provided"}</p>
                                </div>
                                <div className="space-y-2 md:col-span-2 group">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-red-500 transition-colors">
                                        <Shield className="h-3 w-3" /> Bio
                                    </p>
                                    <p className="text-lg text-gray-600 italic leading-relaxed">
                                        {user.bio || "No bio added yet. Tell us something about yourself!"}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="tickets" className="animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 gap-6">
                            {tickets.length > 0 ? (
                                tickets.map(ticket => (
                                    <Card key={ticket._id} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group">
                                        <CardContent className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                                            <div className="flex items-center gap-6">
                                                <div className="h-20 w-20 bg-red-50 rounded-2xl flex flex-col items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                                    <span className="text-xs font-black uppercase tracking-tighter">
                                                        {new Date(ticket.event?.date).toLocaleDateString(undefined, { month: 'short' })}
                                                    </span>
                                                    <span className="text-2xl font-black">
                                                        {new Date(ticket.event?.date).toLocaleDateString(undefined, { day: '2-digit' })}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{ticket.event?.title}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" /> {ticket.event?.location}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Shield className="h-3 w-3" /> ID: {ticket._id.slice(-6).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <Badge className="bg-green-500 hover:bg-green-600 border-none px-4 py-1 text-xs font-bold">
                                                    CONFIRMED
                                                </Badge>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Booked {new Date(ticket.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            ) : (
                                <Card className="border-none shadow-sm rounded-3xl p-20 text-center bg-white">
                                    <div className="h-20 w-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Ticket className="h-10 w-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">No tickets found</h3>
                                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">You haven't booked any experiences yet. Ready for your next big adventure?</p>
                                    <Button className="bg-red-500 hover:bg-red-600 rounded-xl px-10 h-12 font-bold shadow-lg shadow-red-200" onClick={() => navigate("/")}>
                                        Explore Events
                                    </Button>
                                </Card>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="settings" className="animate-in fade-in duration-500">
                        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                            <CardHeader className="bg-white border-b p-8">
                                <CardTitle className="text-2xl font-black uppercase italic tracking-tight text-gray-900">Account Settings</CardTitle>
                                <CardDescription>Manage your security and preferences</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="space-y-4">
                                    {/* Change Password Dialog */}
                                    <Dialog open={isChangingPassword} onOpenChange={setIsChangingPassword}>
                                        <DialogTrigger asChild>
                                            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors cursor-pointer group">
                                                <div>
                                                    <p className="font-bold text-gray-800 text-lg group-hover:text-red-500 transition-colors">Change Password</p>
                                                    <p className="text-sm text-gray-500">Update your account password for better security</p>
                                                </div>
                                                <Button variant="outline" className="rounded-xl border-gray-200 h-10 px-6 font-bold">Update</Button>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="rounded-3xl border-none shadow-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Change Password</DialogTitle>
                                                <DialogDescription>Enter your current password and a new one.</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleChangePassword} className="space-y-4 py-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Current Password</label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.currentPassword}
                                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                        className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">New Password</label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.newPassword}
                                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                        className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-widest text-gray-400">Confirm New Password</label>
                                                    <Input
                                                        type="password"
                                                        value={passwordData.confirmPassword}
                                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                        className="rounded-xl h-12 border-gray-100 bg-gray-50 focus:bg-white"
                                                        required
                                                    />
                                                </div>
                                                <DialogFooter>
                                                    <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 rounded-xl h-12 font-black italic uppercase tracking-widest mt-4">Update Password</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <div className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-red-200 transition-colors">
                                        <div>
                                            <p className="font-bold text-gray-800 text-lg">Privacy Preferences</p>
                                            <p className="text-sm text-gray-500">Manage how your profile is shown to others</p>
                                        </div>
                                        <Button variant="outline" className="rounded-xl border-gray-200 h-10 px-6 font-bold">Manage</Button>
                                    </div>

                                    {/* Delete Account Button */}
                                    <div className="flex items-center justify-between p-6 bg-red-50/50 rounded-2xl border border-red-100 mt-8">
                                        <div>
                                            <p className="font-bold text-red-600 text-lg">Delete Account</p>
                                            <p className="text-sm text-red-500">Permanently remove your account and all data</p>
                                        </div>
                                        <Button
                                            variant="destructive"
                                            className="rounded-xl h-10 px-6 font-bold"
                                            onClick={handleDeleteAccount}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

export default Profile;
