"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { FaUserCircle, FaArrowLeft, FaCoins, FaSignOutAlt, FaIdCard, FaFileAlt, FaCheckCircle, FaClock, FaUpload, FaTimes, FaShieldAlt, FaTrophy, FaStar, FaWhatsapp } from "react-icons/fa";
import { SiAlipay } from "react-icons/si";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Loading from "@/components/Loading";

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'id' | 'cv' | ''>('');
    const [showAlipayForm, setShowAlipayForm] = useState(false);
    const [alipayDetails, setAlipayDetails] = useState({
        alipayAccount: '',
        confirmAlipayAccount: '',
        fullName: ''
    });
    const [localDocuments, setLocalDocuments] = useState<{
        id?: { file: File; url: string; uploadDate: Date };
        cv?: { file: File; url: string; uploadDate: Date };
    }>({});

    // Utility functions for localStorage
    const saveDocumentToLocalStorage = (fileType: 'id' | 'cv', file: File, url: string) => {
        const documentData = {
            file,
            url,
            uploadDate: new Date(),
            status: 'pending' // Track the status locally
        };
        
        const existingData = JSON.parse(localStorage.getItem('uploadedDocuments') || '{}');
        existingData[fileType] = {
            ...documentData,
            file: {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            },
            status: 'pending'
        };
        
        localStorage.setItem('uploadedDocuments', JSON.stringify(existingData));
        setLocalDocuments(prev => ({ ...prev, [fileType]: documentData }));
    };

    const loadDocumentsFromLocalStorage = () => {
        try {
            const savedData = localStorage.getItem('uploadedDocuments');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                const loadedDocs: any = {};
                
                Object.keys(parsedData).forEach(key => {
                    if (parsedData[key]) {
                        loadedDocs[key] = {
                            ...parsedData[key],
                            uploadDate: new Date(parsedData[key].uploadDate)
                        };
                    }
                });
                
                setLocalDocuments(loadedDocs);
            }
        } catch (error) {
            console.error('Error loading documents from localStorage:', error);
        }
    };

    const clearLocalStorage = () => {
        localStorage.removeItem('uploadedDocuments');
        setLocalDocuments({});
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ uid: currentUser.uid, ...userDoc.data() });
                }
                // Load documents from localStorage
                loadDocumentsFromLocalStorage();
            } else {
                router.push("/login");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/");
    };

    const handleFileUpload = async () => {
        if (!selectedFile || !fileType || !user) return;

        setUploading(true);
        try {
            // Create a mock download URL for localStorage
            const mockDownloadURL = `local://${fileType}/${selectedFile.name}`;
            
            // Update Firestore to show pending status (without actual file upload)
            await updateDoc(doc(db, "users", user.uid), {
                [`${fileType}Status`]: 'pending',
                [`${fileType}UploadDate`]: new Date()
            });

            // Save to localStorage with pending status
            saveDocumentToLocalStorage(fileType, selectedFile, mockDownloadURL);

            // Refresh user data
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUser({ uid: user.uid, ...userDoc.data() });
            }

            setSelectedFile(null);
            setFileType('');
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setUploading(false);
        }
    };

    const handleAlipayConnect = async () => {
        if (!user) return;

        // Validate Alipay details
        if (!alipayDetails.alipayAccount || !alipayDetails.confirmAlipayAccount || !alipayDetails.fullName) {
            alert("Please fill all required Alipay account fields");
            return;
        }

        if (alipayDetails.alipayAccount !== alipayDetails.confirmAlipayAccount) {
            alert("Alipay accounts do not match");
            return;
        }

        // Prevent duplicate connection in this browser using localStorage bindings
        try {
            const currentEmail = (user?.email || "").toLowerCase();
            const accountKey = alipayDetails.alipayAccount.trim().toLowerCase();
            const raw = localStorage.getItem("alipay_bindings") || "{}";
            const bindings = JSON.parse(raw || "{}");
            const existingEmail = bindings[accountKey];
            if (existingEmail && existingEmail !== currentEmail) {
                alert("This Alipay account is already connected to another profile on this device. Please use a different Alipay account.");
                return;
            }
        } catch {}

        try {
            await updateDoc(doc(db, "users", user.uid), {
                alipayConnected: true,
                alipayDetails: {
                    account: alipayDetails.alipayAccount,
                    fullName: alipayDetails.fullName
                },
                alipayConnectDate: new Date()
            });

            // Refresh user data
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUser({ uid: user.uid, ...userDoc.data() });
            }

            // Persist binding locally to avoid duplicate connections in this browser
            try {
                const currentEmail = (user?.email || "").toLowerCase();
                const accountKey = alipayDetails.alipayAccount.trim().toLowerCase();
                const raw = localStorage.getItem("alipay_bindings") || "{}";
                const bindings = JSON.parse(raw || "{}");
                bindings[accountKey] = currentEmail;
                localStorage.setItem("alipay_bindings", JSON.stringify(bindings));
                localStorage.setItem("alipay_connected_email", currentEmail);
            } catch {}

            setAlipayDetails({
                alipayAccount: '',
                confirmAlipayAccount: '',
                fullName: ''
            });
            setShowAlipayForm(false);
        } catch (error) {
            console.error("Alipay connection failed:", error);
        }
    };

    const calculateCompletion = () => {
        let completed = 0;
        const total = 4; // ID, CV, Alipay, Profile info

        if (user?.idStatus === 'verified') completed++;
        if (user?.cvStatus === 'verified') completed++;
        if (user?.alipayConnected) completed++;
        if (user?.name && user?.email) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = calculateCompletion();
    const completedTasks = user?.completedTasks?.length || 0;
    const rank = completedTasks >= 50 ? "Elite" : completedTasks >= 20 ? "Gold" : "Silver";

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-4 px-3 sm:py-6 sm:px-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-4 sm:mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md mb-4"
                >
                    <FaArrowLeft className="text-sm" />
                    <span>Back</span>
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-md border border-slate-300 overflow-hidden">
                    <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 p-4 sm:p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-cyan-400 rounded-full filter blur-3xl opacity-20"></div>
                        
                        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/30">
                                <FaUserCircle className="text-3xl sm:text-4xl text-white" />
                            </div>
                            
                            <div className="text-center sm:text-left flex-1">
                                <h1 className="text-xl sm:text-2xl font-extrabold text-white mb-1">{user?.name || "Guest User"}</h1>
                                <p className="text-blue-100 text-xs sm:text-sm font-medium mb-2 truncate">{user?.email}</p>
                                
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                                        <FaTrophy className="text-amber-400 text-xs" />
                                        <span className="text-white text-xs font-bold">{rank}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/30">
                                        <FaStar className="text-yellow-400 text-xs" />
                                        <span className="text-white text-xs font-bold">{completedTasks} Tasks</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Circle */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        className="text-white/20 stroke-current"
                                        strokeWidth="8"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                    />
                                    <circle
                                        className="text-white stroke-current"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        fill="transparent"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 * (1 - completionPercentage / 100)}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl sm:text-2xl font-extrabold text-white">{completionPercentage}%</span>
                                    <span className="text-[9px] sm:text-xs text-blue-100 font-medium">Complete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                    {/* Balance Card */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-slate-300 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-slate-700 mb-1">Account Balance</h3>
                                <p className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mt-1">
                                    ${user?.balance?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-xs text-slate-500 font-medium mt-1">Available</p>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl shadow-md flex-shrink-0">
                                <FaCoins className="text-2xl sm:text-3xl text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border border-slate-300">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-lg">
                                <FaShieldAlt className="text-lg text-white" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Verification</h3>
                                <p className="text-xs text-slate-600">Complete to unlock features</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* ID Verification */}
                            <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                                            user?.idStatus === 'verified' ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
                                            user?.idStatus === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 
                                            localDocuments.id ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                                            'bg-gradient-to-br from-slate-300 to-slate-400'
                                        }`}>
                                            <FaIdCard className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">ID Document</p>
                                            <p className="text-sm font-medium ${
                                                user?.idStatus === 'verified' ? 'text-emerald-600' :
                                                (user?.idStatus === 'pending' || localDocuments.id) ? 'text-amber-600' : 'text-slate-500'
                                            }">
                                                {user?.idStatus === 'verified' ? 'Verified ✓' :
                                                 (user?.idStatus === 'pending' || localDocuments.id) ? 'Under Review' : 'Action Required'}
                                            </p>
                                            {localDocuments.id && (
                                                <p className="text-xs text-slate-500">
                                                    Uploaded: {localDocuments.id.uploadDate.toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {user?.idStatus === 'verified' ? (
                                        <FaCheckCircle className="text-emerald-500 text-2xl" />
                                    ) : (user?.idStatus === 'pending' || localDocuments.id) ? (
                                        <FaClock className="text-amber-500 text-2xl animate-pulse" />
                                    ) : (
                                        <button
                                            onClick={() => setFileType('id')}
                                            className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-xl text-sm font-bold hover:from-blue-950 hover:to-cyan-800 transition-all duration-300 shadow-lg"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* CV Verification */}
                            <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                                            user?.cvStatus === 'verified' ? 'bg-gradient-to-br from-emerald-500 to-green-500' :
                                            user?.cvStatus === 'pending' ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 
                                            localDocuments.cv ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                                            'bg-gradient-to-br from-slate-300 to-slate-400'
                                        }`}>
                                            <FaFileAlt className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">CV/Resume</p>
                                            <p className={`text-sm font-medium ${
                                                user?.cvStatus === 'verified' ? 'text-emerald-600' :
                                                (user?.cvStatus === 'pending' || localDocuments.cv) ? 'text-amber-600' : 'text-slate-500'
                                            }`}>
                                                {user?.cvStatus === 'verified' ? 'Verified ✓' :
                                                 (user?.cvStatus === 'pending' || localDocuments.cv) ? 'Under Review' : 'Action Required'}
                                            </p>
                                            {localDocuments.cv && (
                                                <p className="text-xs text-slate-500">
                                                    Uploaded: {localDocuments.cv.uploadDate.toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {user?.cvStatus === 'verified' ? (
                                        <FaCheckCircle className="text-emerald-500 text-2xl" />
                                    ) : (user?.cvStatus === 'pending' || localDocuments.cv) ? (
                                        <FaClock className="text-amber-500 text-2xl animate-pulse" />
                                    ) : (
                                        <button
                                            onClick={() => setFileType('cv')}
                                            className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-xl text-sm font-bold hover:from-blue-950 hover:to-cyan-800 transition-all duration-300 shadow-lg"
                                        >
                                            Upload
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Alipay Connection */}
                            <div className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                                            user?.alipayConnected ? 'bg-gradient-to-br from-blue-600 to-blue-700' : 'bg-gradient-to-br from-slate-300 to-slate-400'
                                        }`}>
                                            <SiAlipay className="text-2xl text-white" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">Alipay Account</p>
                                            <p className={`text-sm font-medium ${user?.alipayConnected ? 'text-blue-600' : 'text-slate-500'}`}>
                                                {user?.alipayConnected ? 'Account Connected ✓' : 'Not Connected'}
                                            </p>
                                        </div>
                                    </div>
                                    {user?.alipayConnected ? (
                                        <FaCheckCircle className="text-emerald-500 text-2xl" />
                                    ) : (
                                        <button
                                            onClick={() => setShowAlipayForm(true)}
                                            className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-xl text-sm font-bold hover:from-blue-950 hover:to-cyan-800 transition-all duration-300 shadow-lg"
                                        >
                                            Connect
                                        </button>
                                    )}
                                </div>
                                {!user?.alipayConnected && (
                                  <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                                    <p className="text-sm text-emerald-900 font-semibold mb-2">If you don't have an Alipay account, join our WhatsApp to get one:</p>
                                    <div className="flex flex-wrap gap-3">
                                      <a
                                        href="https://chat.whatsapp.com/GXtKCOh8VZuF5otSjnSH2i?mode=wwt"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold shadow-sm"
                                      >
                                        <FaWhatsapp className="text-base" /> WhatsApp Group
                                      </a>
                                      <a
                                        href="https://whatsapp.com/channel/0029VbB2aOZ9WtC5F6muRh3W"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/90 hover:bg-emerald-600 text-white text-sm font-bold shadow-sm"
                                      >
                                        <FaWhatsapp className="text-base" /> WhatsApp Channel
                                      </a>
                                    </div>
                                  </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* File Upload Section */}
                    {fileType && (
                        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-200 animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900">
                                    Upload {fileType === 'id' ? 'ID Document' : 'CV/Resume'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setFileType('');
                                        setSelectedFile(null);
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <FaTimes className="text-xl text-slate-500" />
                                </button>
                            </div>

                            <div className="border-3 border-dashed border-blue-300 rounded-2xl p-8 text-center bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-blue-500 transition-all duration-300">
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="file-upload"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-cyan-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <FaUpload className="text-3xl text-white" />
                                    </div>
                                    <p className="text-slate-900 font-bold mb-2">
                                        {selectedFile ? selectedFile.name : 'Click to select file'}
                                    </p>
                                    <p className="text-sm text-slate-600">PDF, JPG, or PNG (Max 5MB)</p>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setFileType('');
                                        setSelectedFile(null);
                                    }}
                                    className="flex-1 py-3 px-4 border-2 border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFileUpload}
                                    disabled={!selectedFile || uploading}
                                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-xl font-bold hover:from-blue-950 hover:to-cyan-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                >
                                    {uploading ? 'Uploading...' : 'Submit Document'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Alipay Connection Form */}
                    {showAlipayForm && (
                        <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-200 animate-fade-in">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <SiAlipay className="text-blue-600" />
                                    Connect Alipay Account
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowAlipayForm(false);
                                        setAlipayDetails({
                                            alipayAccount: '',
                                            confirmAlipayAccount: '',
                                            fullName: ''
                                        });
                                    }}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <FaTimes className="text-xl text-slate-500" />
                                </button>
                            </div>

                            <div className="space-y-5">
                                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200">
                                    <p className="text-sm text-blue-900 font-medium">
                                        <strong>💰 International Payments:</strong> Alipay accepts email addresses and phone numbers. 
                                        USD payments are automatically converted to CNY.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 font-medium"
                                        value={alipayDetails.fullName}
                                        onChange={(e) => setAlipayDetails({ ...alipayDetails, fullName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Alipay Account (Email or Phone) *</label>
                                    <input
                                        type="text"
                                        placeholder="your@email.com or +86 123 4567 8900"
                                        className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 font-medium"
                                        value={alipayDetails.alipayAccount}
                                        onChange={(e) => setAlipayDetails({ ...alipayDetails, alipayAccount: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Alipay Account *</label>
                                    <input
                                        type="text"
                                        placeholder="your@email.com or +86 123 4567 8900"
                                        className="w-full p-3 bg-slate-50 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all duration-300 font-medium"
                                        value={alipayDetails.confirmAlipayAccount}
                                        onChange={(e) => setAlipayDetails({ ...alipayDetails, confirmAlipayAccount: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => {
                                            setShowAlipayForm(false);
                                            setAlipayDetails({
                                                alipayAccount: '',
                                                confirmAlipayAccount: '',
                                                fullName: ''
                                            });
                                        }}
                                        className="flex-1 py-3 px-4 border-2 border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition-all duration-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAlipayConnect}
                                        disabled={
                                            !alipayDetails.alipayAccount ||
                                            !alipayDetails.confirmAlipayAccount ||
                                            !alipayDetails.fullName ||
                                            alipayDetails.alipayAccount !== alipayDetails.confirmAlipayAccount
                                        }
                                        className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-900 to-cyan-700 text-white rounded-xl font-bold hover:from-blue-950 hover:to-cyan-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                                    >
                                        Connect Alipay
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Completion Progress */}
                    <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-200">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Profile Completion</h3>

                        <div className="space-y-4">
                            {[
                                { label: 'Profile Information', completed: !!(user?.name && user?.email), icon: FaUserCircle },
                                { label: 'ID Verification', completed: user?.idStatus === 'verified', icon: FaIdCard },
                                { label: 'CV/Resume Upload', completed: user?.cvStatus === 'verified', icon: FaFileAlt },
                                { label: 'Alipay Connection', completed: user?.alipayConnected, icon: SiAlipay }
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${item.completed ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                                                <Icon className="text-white" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{item.label}</span>
                                        </div>
                                        {item.completed ? (
                                            <FaCheckCircle className="text-emerald-500 text-xl" />
                                        ) : (
                                            <div className="w-6 h-6 border-3 border-slate-300 rounded-full"></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <FaSignOutAlt />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>

            {/* Benefits Info */}
            <div className="max-w-6xl mx-auto mt-8">
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl p-6">
                    <h4 className="font-extrabold text-amber-900 mb-3 flex items-center gap-2 text-lg">
                        🎯 Complete Your Profile to Unlock:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                            <span className="text-sm text-amber-900 font-medium">Higher-paying tasks</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                            <span className="text-sm text-amber-900 font-medium">Priority task access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                            <span className="text-sm text-amber-900 font-medium">Faster withdrawals</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;