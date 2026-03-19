/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FlaskConical, 
  CloudSun, 
  FileText, 
  Settings, 
  User as UserIcon,
  Sprout,
  LogIn,
  LogOut,
  History
} from 'lucide-react';
import { TopOverview } from './components/TopOverview';
import { FieldMap } from './components/FieldMap';
import { IrrigationWeather } from './components/IrrigationWeather';
import { InsightsPanel } from './components/InsightsPanel';
import { InputSection } from './components/InputSection';
import { analyzeSoilData } from './services/gemini';
import { SoilData, AnalysisResult } from './types';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logout, 
  onAuthStateChanged, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  handleFirestoreError,
  OperationType,
  User
} from './firebase';

const DEMO_RESULT: AnalysisResult = {
  recommendations: [
    {
      crop: "Maize (Corn)",
      suitabilityScore: 92,
      icon: "🌽",
      fertilizer: {
        type: "NPK 15-15-15",
        schedule: "Every 2 weeks",
        dosage: "250kg/hectare"
      },
      irrigation: {
        frequency: "Twice weekly",
        method: "Drip Irrigation",
        amount: "15mm",
        timeline: [
          { time: "06:00", action: "Start Drip" },
          { time: "08:00", action: "Stop Drip" }
        ]
      },
      warnings: ["High humidity may lead to fungal growth", "Monitor for corn borer"],
      alternatives: ["Soybeans", "Sorghum"],
      expectedYield: 8.5
    }
  ],
  summary: "The soil profile shows optimal nutrient levels for cereal crops. High nitrogen content and balanced pH make this field ideal for high-yield maize production this season.",
  soilHealthStatus: "Excellent",
  weatherForecast: [
    { day: "Mon", temp: 28, condition: "Sunny", rainfall: 0 },
    { day: "Tue", temp: 26, condition: "Cloudy", rainfall: 2 },
    { day: "Wed", temp: 24, condition: "Rainy", rainfall: 15 },
    { day: "Thu", temp: 27, condition: "Sunny", rainfall: 0 }
  ],
  heatmapData: [
    { x: 0, y: 0, value: 85, label: "Zone A1" },
    { x: 1, y: 0, value: 92, label: "Zone A2" },
    { x: 2, y: 0, value: 78, label: "Zone A3" },
    { x: 0, y: 1, value: 88, label: "Zone B1" },
    { x: 1, y: 1, value: 95, label: "Zone B2" },
    { x: 2, y: 1, value: 82, label: "Zone B3" },
    { x: 0, y: 2, value: 75, label: "Zone C1" },
    { x: 1, y: 2, value: 80, label: "Zone C2" },
    { x: 2, y: 2, value: 70, label: "Zone C3" }
  ],
  aiInsights: [
    {
      title: "Nutrient Optimization",
      description: "Current nitrogen levels are 15% above average, allowing for reduced fertilizer costs.",
      impact: "High",
      type: "insight"
    },
    {
      title: "Irrigation Alert",
      description: "Upcoming rain on Wednesday suggests skipping irrigation on Tuesday evening.",
      impact: "Medium",
      type: "tip"
    }
  ]
};

export default function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = React.useState('Dashboard');
  const [user, setUser] = React.useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = React.useState(false);
  const [savedPlans, setSavedPlans] = React.useState<any[]>([]);

  // Auth Listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        // Sync user profile to Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            createdAt: new Date().toISOString(),
            role: 'user'
          }, { merge: true });
          
          // Fetch saved plans
          fetchSavedPlans(currentUser.uid);
        } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.uid}`);
        }
      } else {
        setSavedPlans([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchSavedPlans = async (uid: string) => {
    const plansRef = collection(db, 'users', uid, 'cropPlans');
    try {
      const q = query(plansRef);
      const querySnapshot = await getDocs(q);
      const plans = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedPlans(plans);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, `users/${uid}/cropPlans`);
    }
  };

  const handleAnalyze = async (data: SoilData) => {
    setIsLoading(true);
    try {
      const analysis = await analyzeSoilData(data);
      setResult(analysis);

      // Save to Firestore if logged in
      if (user) {
        const planId = `plan_${Date.now()}`;
        const planRef = doc(db, 'users', user.uid, 'cropPlans', planId);
        await setDoc(planRef, {
          uid: user.uid,
          soilData: data,
          recommendations: analysis.recommendations,
          heatmapData: analysis.heatmapData,
          aiInsights: analysis.aiInsights,
          summary: analysis.summary,
          soilHealthStatus: analysis.soilHealthStatus,
          weatherForecast: analysis.weatherForecast,
          createdAt: new Date().toISOString()
        });
        fetchSavedPlans(user.uid);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
    { name: 'Crop Plan', id: 'crop-plan', icon: ClipboardList },
    { name: 'Soil Data', id: 'soil-data', icon: FlaskConical },
    { name: 'Weather', id: 'weather', icon: CloudSun },
    { name: 'Reports', id: 'reports', icon: FileText },
    { name: 'History', id: 'history', icon: History },
    { name: 'Settings', id: 'settings', icon: Settings },
  ];

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-cyan-900/30 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-stone-950/80 backdrop-blur-md border-b border-cyan-900/30 px-6 flex items-center justify-between fixed top-0 left-0 right-0 z-50 shadow-xl shadow-cyan-950/20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-stone-950 shadow-lg shadow-cyan-500/20">
              <Sprout className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-white">Soil <span className="text-cyan-400">Track</span></h1>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.id)}
                className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'text-cyan-400 border-b-2 border-cyan-400 pb-1' 
                    : 'text-stone-400 hover:text-cyan-300'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-bold text-white uppercase tracking-widest">{user.displayName}</p>
                <button onClick={logout} className="text-[8px] font-bold text-cyan-500 uppercase tracking-tighter hover:text-cyan-400">Sign Out</button>
              </div>
              <img 
                src={user.photoURL || ''} 
                alt={user.displayName || ''} 
                className="w-8 h-8 rounded-full border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-stone-950 text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest transition-all shadow-lg shadow-cyan-500/20"
            >
              <LogIn className="w-3 h-3" />
              Sign In
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex pt-16 overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-12 scroll-smooth">
          {!result && (
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 py-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-24 h-24 bg-cyan-500/10 rounded-3xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
              >
                <Sprout className="w-12 h-12" />
              </motion.div>
              
              <div className="max-w-2xl space-y-4">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl font-bold tracking-tight text-white"
                >
                  Ready to Optimize Your <span className="text-cyan-400">Harvest?</span>
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-stone-400 text-lg leading-relaxed"
                >
                  Welcome to your Soil Track Advisor. To get started, enter your field's soil parameters in the section above and click <strong>"Get Crop Plan"</strong>.
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-8"
              >
                {[
                  { icon: FlaskConical, title: "Soil Analysis", desc: "Input NPK, pH, and moisture levels" },
                  { icon: LayoutDashboard, title: "Smart Mapping", desc: "Visualize field health zones" },
                  { icon: CloudSun, title: "Weather Sync", desc: "Get irrigation alerts based on forecast" }
                ].map((item, i) => (
                  <div key={i} className="bg-stone-900/50 p-6 rounded-2xl border border-cyan-900/20 text-left space-y-3">
                    <item.icon className="w-6 h-6 text-cyan-500" />
                    <h3 className="font-bold text-white uppercase tracking-widest text-xs">{item.title}</h3>
                    <p className="text-stone-500 text-xs leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </motion.div>
            </section>
          )}

          {/* Dashboard Section */}
          {result && (
            <>
              <section id="dashboard" className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Overview</div>
                </div>
                <TopOverview recommendations={result.recommendations} />
              </section>

              {/* Crop Plan Section */}
              <section id="crop-plan" className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Crop Plan</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Mapping</div>
                </div>
                <FieldMap data={result.heatmapData} />
              </section>

              {/* Soil Data Section */}
              <section id="soil-data" className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Soil Data</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Analysis</div>
                </div>
                <div className="bg-cyan-950/50 border border-cyan-500/20 rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Sprout className="w-32 h-32 text-cyan-400" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400">Soil Health: {result.soilHealthStatus}</h3>
                    <p className="text-sm text-cyan-100 leading-relaxed italic">"{result.summary}"</p>
                  </div>
                </div>
              </section>

              {/* Weather Section */}
              <section id="weather" className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Weather</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Forecast</div>
                </div>
                <IrrigationWeather 
                  weather={result.weatherForecast} 
                  recommendation={result.recommendations[0]} 
                />
              </section>

              {/* Reports Section */}
              <section id="reports" className="scroll-mt-24 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight text-white">Reports</h2>
                  <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Insights</div>
                </div>
                <InsightsPanel insights={result.aiInsights} />
              </section>
            </>
          )}

          {/* History Section */}
          {user && savedPlans.length > 0 && (
            <section id="history" className="scroll-mt-24 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-white">History</h2>
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Saved Plans</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedPlans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => setResult(plan)}
                    className="bg-stone-900 p-4 rounded-xl border border-stone-800 hover:border-cyan-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-cyan-950/50 rounded-lg border border-cyan-500/20">
                        <History className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs font-bold text-white">{plan.recommendations[0].crop}</p>
                      </div>
                    </div>
                    <p className="text-[10px] text-stone-500 line-clamp-2 italic">"{plan.summary}"</p>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Input Section */}
          <section className="scroll-mt-24">
            <InputSection onAnalyze={handleAnalyze} isLoading={isLoading} />
          </section>

          {/* Settings Section */}
          <section id="settings" className="scroll-mt-24 space-y-6 pb-24">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-white">Settings</h2>
              <div className="text-xs font-bold uppercase tracking-widest text-cyan-500/50">Configuration</div>
            </div>
            <div className="bg-stone-900 p-8 rounded-2xl border border-cyan-900/20 shadow-sm text-center space-y-6">
              <div className="w-16 h-16 bg-cyan-950/50 rounded-2xl flex items-center justify-center text-cyan-400 mx-auto border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Welcome to Soil Track</h3>
                <p className="text-stone-400 max-w-sm mx-auto mt-2">
                  Currently viewing <span className="text-cyan-400 font-bold">Sample Field Data</span>. 
                  Adjust your field data in the section above and click "Get Crop Plan" to generate your personalized agricultural dashboard.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
