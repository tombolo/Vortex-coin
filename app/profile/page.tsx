"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { getStorage } from "firebase/storage";
const storage = getStorage();
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaUserCircle, FaArrowLeft, FaCoins, FaEnvelope, FaSignOutAlt, FaIdCard, FaCreditCard, FaFileAlt, FaCheckCircle, FaClock, FaUpload, FaPercentage, FaTimes, FaGlobe } from "react-icons/fa";
import { signOut, onAuthStateChanged } from "firebase/auth";

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileType, setFileType] = useState<'id' | 'cv' | ''>('');
    const [showBankForm, setShowBankForm] = useState(false);
    const [bankType, setBankType] = useState<'wise' | 'traditional' | ''>('');
    const [bankDetails, setBankDetails] = useState({
        accountNumber: '',
        routingNumber: '',
        accountName: '',
        // Wise-specific fields
        currency: 'USD',
        country: '',
        accountType: 'checking',
        iban: '',
        swiftBic: '',
        wiseEmail: ''
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUser({ uid: currentUser.uid, ...userDoc.data() });
                }
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
            const fileRef = ref(storage, `verifications/${user.uid}/${fileType}/${selectedFile.name}`);
            await uploadBytes(fileRef, selectedFile);
            const downloadURL = await getDownloadURL(fileRef);

            await updateDoc(doc(db, "users", user.uid), {
                [`${fileType}Status`]: 'pending',
                [`${fileType}Url`]: downloadURL,
                [`${fileType}UploadDate`]: new Date()
            });

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

    const handleBankConnect = async () => {
        if (!user || !bankDetails.accountName) return;

        // Validate based on bank type
        if (bankType === 'wise') {
            if (!bankDetails.currency || !bankDetails.country || !bankDetails.wiseEmail) {
                alert("Please fill all required Wise account fields");
                return;
            }
        } else if (bankType === 'traditional') {
            if (!bankDetails.accountNumber || !bankDetails.routingNumber) {
                alert("Please fill all required bank account fields");
                return;
            }
        } else {
            alert("Please select a bank type");
            return;
        }

        try {
            await updateDoc(doc(db, "users", user.uid), {
                bankConnected: true,
                bankType: bankType,
                bankDetails: bankDetails,
                bankConnectDate: new Date()
            });

            // Refresh user data
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                setUser({ uid: user.uid, ...userDoc.data() });
            }

            setBankDetails({
                accountNumber: '',
                routingNumber: '',
                accountName: '',
                currency: 'USD',
                country: '',
                accountType: 'checking',
                iban: '',
                swiftBic: '',
                wiseEmail: ''
            });
            setBankType('');
            setShowBankForm(false);
        } catch (error) {
            console.error("Bank connection failed:", error);
        }
    };

    const calculateCompletion = () => {
        let completed = 0;
        const total = 4; // ID, CV, Bank, Profile info

        if (user?.idStatus === 'verified') completed++;
        if (user?.cvStatus === 'verified') completed++;
        if (user?.bankConnected) completed++;
        if (user?.name && user?.email) completed++;

        return Math.round((completed / total) * 100);
    };

    const completionPercentage = calculateCompletion();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                        <FaArrowLeft className="text-lg" />
                        <span>Back</span>
                    </button>

                    {/* Progress Circle */}
                    <div className="relative w-20 h-20">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                                className="text-gray-200 stroke-current"
                                strokeWidth="10"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                            />
                            <circle
                                className="text-indigo-600 stroke-current"
                                strokeWidth="10"
                                strokeLinecap="round"
                                cx="50"
                                cy="50"
                                r="40"
                                fill="transparent"
                                strokeDasharray="251.2"
                                strokeDashoffset={251.2 * (1 - completionPercentage / 100)}
                                transform="rotate(-90 50 50)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-lg font-bold text-indigo-700">{completionPercentage}%</span>
                        </div>
                    </div>
                </div>

                <div className="text-center mt-6">
                    <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <FaUserCircle className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{user?.name || "Guest User"}</h1>
                    <p className="text-gray-600 mt-2">{user?.email}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Profile Info */}
                <div className="space-y-6">
                    {/* Balance Card */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Account Balance</h3>
                                <p className="text-3xl font-bold text-emerald-600 mt-2">${user?.balance || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                <FaCoins className="text-2xl text-emerald-600" />
                            </div>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Status</h3>

                        {/* ID Verification */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.idStatus === 'verified' ? 'bg-emerald-100' :
                                    user?.idStatus === 'pending' ? 'bg-amber-100' : 'bg-gray-100'
                                    }`}>
                                    <FaIdCard className={
                                        user?.idStatus === 'verified' ? 'text-emerald-600' :
                                            user?.idStatus === 'pending' ? 'text-amber-600' : 'text-gray-400'
                                    } />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">ID Verification</p>
                                    <p className="text-sm text-gray-500">
                                        {user?.idStatus === 'verified' ? 'Verified' :
                                            user?.idStatus === 'pending' ? 'Under Review' : 'Action Required'}
                                    </p>
                                </div>
                            </div>
                            {user?.idStatus === 'verified' ? (
                                <FaCheckCircle className="text-emerald-500 text-xl" />
                            ) : user?.idStatus === 'pending' ? (
                                <FaClock className="text-amber-500 text-xl" />
                            ) : (
                                <button
                                    onClick={() => setFileType('id')}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Upload
                                </button>
                            )}
                        </div>

                        {/* CV Verification */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.cvStatus === 'verified' ? 'bg-emerald-100' :
                                    user?.cvStatus === 'pending' ? 'bg-amber-100' : 'bg-gray-100'
                                    }`}>
                                    <FaFileAlt className={
                                        user?.cvStatus === 'verified' ? 'text-emerald-600' :
                                            user?.cvStatus === 'pending' ? 'text-amber-600' : 'text-gray-400'
                                    } />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">CV/Resume</p>
                                    <p className="text-sm text-gray-500">
                                        {user?.cvStatus === 'verified' ? 'Verified' :
                                            user?.cvStatus === 'pending' ? 'Under Review' : 'Action Required'}
                                    </p>
                                </div>
                            </div>
                            {user?.cvStatus === 'verified' ? (
                                <FaCheckCircle className="text-emerald-500 text-xl" />
                            ) : user?.cvStatus === 'pending' ? (
                                <FaClock className="text-amber-500 text-xl" />
                            ) : (
                                <button
                                    onClick={() => setFileType('cv')}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Upload
                                </button>
                            )}
                        </div>

                        {/* Bank Connection */}
                        <div className="flex items-center justify-between py-3">
                            <div className="flex items-center space-x-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user?.bankConnected ? 'bg-emerald-100' : 'bg-gray-100'
                                    }`}>
                                    <FaCreditCard className={user?.bankConnected ? 'text-emerald-600' : 'text-gray-400'} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Bank Account</p>
                                    <p className="text-sm text-gray-500">
                                        {user?.bankConnected ?
                                            (user?.bankType === 'wise' ? 'Wise Account Connected' : 'Bank Account Connected')
                                            : 'Not Connected'}
                                    </p>
                                </div>
                            </div>
                            {user?.bankConnected ? (
                                <FaCheckCircle className="text-emerald-500 text-xl" />
                            ) : (
                                <button
                                    onClick={() => setShowBankForm(true)}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-colors"
                                >
                                    Connect
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - File Upload & Actions */}
                <div className="space-y-6">
                    {/* File Upload Section */}
                    {fileType && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Upload {fileType === 'id' ? 'ID Document' : 'CV/Resume'}
                                </h3>
                                <button
                                    onClick={() => {
                                        setFileType('');
                                        setSelectedFile(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>

                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <FaUpload className="text-3xl text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-2">
                                        {selectedFile ? selectedFile.name : 'Click to select file'}
                                    </p>
                                    <p className="text-sm text-gray-500">PDF, JPG, or PNG (Max 5MB)</p>
                                </label>
                            </div>

                            <div className="flex space-x-3 mt-4">
                                <button
                                    onClick={() => {
                                        setFileType('');
                                        setSelectedFile(null);
                                    }}
                                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFileUpload}
                                    disabled={!selectedFile || uploading}
                                    className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Uploading...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Bank Connection Form */}
                    {showBankForm && (
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">Connect Bank Account</h3>
                                <button
                                    onClick={() => {
                                        setShowBankForm(false);
                                        setBankType('');
                                        setBankDetails({
                                            accountNumber: '',
                                            routingNumber: '',
                                            accountName: '',
                                            currency: 'USD',
                                            country: '',
                                            accountType: 'checking',
                                            iban: '',
                                            swiftBic: '',
                                            wiseEmail: ''
                                        });
                                    }}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <FaTimes className="text-lg" />
                                </button>
                            </div>

                            {!bankType ? (
                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900">Select Account Type</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setBankType('wise')}
                                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-center"
                                        >
                                            <FaGlobe className="text-2xl text-indigo-600 mx-auto mb-2" />
                                            <h5 className="font-medium">Wise Account</h5>
                                            <p className="text-sm text-gray-500 mt-1">International payments</p>
                                        </button>
                                        <button
                                            onClick={() => setBankType('traditional')}
                                            className="p-4 border-2 border-gray-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 text-center"
                                        >
                                            <FaCreditCard className="text-2xl text-indigo-600 mx-auto mb-2" />
                                            <h5 className="font-medium">Traditional Bank</h5>
                                            <p className="text-sm text-gray-500 mt-1">Local bank account</p>
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium text-gray-900">
                                            {bankType === 'wise' ? 'Wise Account Details' : 'Bank Account Details'}
                                        </h4>
                                        <button
                                            onClick={() => setBankType('')}
                                            className="text-sm text-indigo-600 hover:text-indigo-700"
                                        >
                                            Change Type
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                                        <input
                                            type="text"
                                            placeholder="John Doe"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                            value={bankDetails.accountName}
                                            onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                                            required
                                        />
                                    </div>

                                    {bankType === 'wise' ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Wise Email Address *</label>
                                                <input
                                                    type="email"
                                                    placeholder="your.email@example.com"
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                    value={bankDetails.wiseEmail}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, wiseEmail: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency *</label>
                                                    <select
                                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                        value={bankDetails.currency}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, currency: e.target.value })}
                                                        required
                                                    >
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                        <option value="CAD">CAD</option>
                                                        <option value="AUD">AUD</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                                                    <select
                                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                        value={bankDetails.country}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, country: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select Country</option>
                                                        <option value="US">United States</option>
                                                        <option value="GB">United Kingdom</option>
                                                        <option value="CA">Canada</option>
                                                        <option value="AU">Australia</option>
                                                        <option value="DE">Germany</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">IBAN</label>
                                                    <input
                                                        type="text"
                                                        placeholder="GB29 NWBK 6016 1331 9268 19"
                                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                        value={bankDetails.iban}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, iban: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">SWIFT/BIC</label>
                                                    <input
                                                        type="text"
                                                        placeholder="ABCDGB2A"
                                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                        value={bankDetails.swiftBic}
                                                        onChange={(e) => setBankDetails({ ...bankDetails, swiftBic: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                                                <input
                                                    type="text"
                                                    placeholder="1234567890"
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                    value={bankDetails.accountNumber}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Routing Number *</label>
                                                <input
                                                    type="text"
                                                    placeholder="021000021"
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                                                    value={bankDetails.routingNumber}
                                                    onChange={(e) => setBankDetails({ ...bankDetails, routingNumber: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="flex space-x-3 mt-6">
                                        <button
                                            onClick={() => {
                                                setShowBankForm(false);
                                                setBankType('');
                                                setBankDetails({
                                                    accountNumber: '',
                                                    routingNumber: '',
                                                    accountName: '',
                                                    currency: 'USD',
                                                    country: '',
                                                    accountType: 'checking',
                                                    iban: '',
                                                    swiftBic: '',
                                                    wiseEmail: ''
                                                });
                                            }}
                                            className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleBankConnect}
                                            disabled={
                                                !bankDetails.accountName ||
                                                (bankType === 'wise' ? (!bankDetails.wiseEmail || !bankDetails.currency || !bankDetails.country) :
                                                    (!bankDetails.accountNumber || !bankDetails.routingNumber))
                                            }
                                            className="flex-1 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Connect {bankType === 'wise' ? 'Wise Account' : 'Bank Account'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Account Actions */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h3>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-200"
                        >
                            <FaSignOutAlt />
                            <span>Sign Out</span>
                        </button>
                    </div>

                    {/* Progress Details */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Completion Progress</h3>

                        <div className="space-y-3">
                            {[
                                { label: 'Profile Information', completed: !!(user?.name && user?.email) },
                                { label: 'ID Verification', completed: user?.idStatus === 'verified' },
                                { label: 'CV/Resume', completed: user?.cvStatus === 'verified' },
                                { label: 'Bank Connection', completed: user?.bankConnected }
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <span className="text-gray-700">{item.label}</span>
                                    {item.completed ? (
                                        <FaCheckCircle className="text-emerald-500" />
                                    ) : (
                                        <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;