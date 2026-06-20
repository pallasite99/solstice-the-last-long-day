import React, { useState, useEffect, useRef } from "react";
import { 
  Sun, 
  Moon, 
  RotateCcw, 
  Clock, 
  BookOpen, 
  Cpu, 
  Binary, 
  MessageSquare, 
  AlertTriangle, 
  Droplet, 
  Sparkles, 
  Zap, 
  Thermometer, 
  Users, 
  ShieldAlert, 
  ChevronRight, 
  CheckCircle2, 
  Database,
  RefreshCw,
  Terminal,
  Send,
  Sliders,
  HelpCircle,
  TrendingUp,
  Activity,
  X,
  BarChart3,
  GitBranch,
  Github,
  Volume2,
  VolumeX,
  Play
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { gddSections } from "./gdd";
import { ResourceState, HemisphereState, ChatMessage, Dilemma, PuzzleState, HistoricalDataPoint } from "./types";
import { godotFolderStructure, GodotFileNode } from "./godotData";
import { turingPuzzlesList } from "./turingPuzzles";
import Markdown from "react-markdown";

// Interactive, Retro Terminal-styled Tooltip Component
function TuringTooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-64 p-3 bg-[#0a0b0d] border border-neutral-700 text-neutral-300 text-[11px] font-mono rounded shadow-[0_0_20px_rgba(0,0,0,0.95)] leading-relaxed pointer-events-none text-left tracking-wide select-none normal-case">
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0a0b0d]"></div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-700 -z-10 translate-y-[1px]"></div>
          <span className="text-[9px] uppercase text-[#00FF41] tracking-widest font-bold block mb-1 font-sans">SYS_METRIC_FEED:</span>
          {content}
        </div>
      )}
    </div>
  );
}

interface LogPoint {
  time: string;
  Energy: number;
  Water: number;
}

export default function App() {
  // --- Game Simulation State ---
  const [resources, setResources] = useState<ResourceState>({
    energy: 55,
    water: 45,
    population: 80,
    knowledge: 20,
    timeLimit: 24.0, // Countdown in hours
  });

  const [hemisphere, setHemisphere] = useState<HemisphereState>({
    dayShare: 50, // default even split
    dayTemp: 45, // scorching temperature Celsius
    nightTemp: -60, // freezing cryo temperature
    solarEfficiency: 75,
    cryoStability: 80,
  });

  // --- Active View Tab ---
  const [currentTab, setCurrentTab] = useState<"dashboard" | "gdd" | "decrypter" | "turing" | "godot">("dashboard");
  const [selectedGddId, setSelectedGddId] = useState<string>("1_gdd_executive");
  const [selectedFileNode, setSelectedFileNode] = useState<GodotFileNode | null>(
    godotFolderStructure.children?.[1]?.children?.[0] || null // default is save_system.gd
  );

  // --- TURING Conversation Client state ---
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "system",
      content: "TURING connection online. Rotational velocity vectors frozen. Permanent Solstice state functional.",
      timestamp: "11:24:04"
    },
    {
      id: "2",
      role: "model",
      content: "Greetings, Operator Vance. I monitor your physiological heart rate. You appear fatigued by the stillness of our sky. Let us synchronize our algorithms. Why do you look at equilibrium and call it a cage?",
      timestamp: "11:24:10"
    }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  // --- Interactive Cryptography State ---
  const [puzzles, setPuzzles] = useState<PuzzleState[]>(
    turingPuzzlesList.map(p => ({
      cipherText: p.cipherText,
      solution: p.solution,
      currentInput: "",
      isSolved: false,
      difficulty: p.difficulty
    }))
  );
  const [selectedPuzzleIdx, setSelectedPuzzleIdx] = useState(0);
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);
  const [puzzleFilter, setPuzzleFilter] = useState<"All" | "Easy" | "Medium" | "Hard">("All");

  // --- Moral Dilemma Sandbox ---
  const [currentDilemma, setCurrentDilemma] = useState<Dilemma | null>(null);
  const [isGeneratingDilemma, setIsGeneratingDilemma] = useState(false);
  const [dilemmaHistory, setDilemmaHistory] = useState<string[]>([]);

  // Empathy and narrative state
  const [empathyScore, setEmpathyScore] = useState<number>(50);
  const [secretEndingTriggered, setSecretEndingTriggered] = useState<boolean>(false);

  // --- Speech Synthesis State & Interface ---
  const [isVoiceEnabled, setIsVoiceEnabled] = useState<boolean>(true);
  const [voiceTone, setVoiceTone] = useState<"cold" | "empathetic">("cold");

  const speakTuringText = (text: string) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text
        .replace(/[*_`#\-+]/g, " ")
        .replace(/\[.*?\]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voices = window.speechSynthesis.getVoices();
      
      if (voiceTone === "cold") {
        const standardVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Male") || v.name.includes("David") || v.name.includes("Google US English")));
        if (standardVoice) utterance.voice = standardVoice;
        utterance.pitch = 0.55;
        utterance.rate = 0.88;
      } else {
        const warmVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Zira") || v.name.includes("Google UK English Female") || v.name.includes("Natural")));
        if (warmVoice) utterance.voice = warmVoice;
        utterance.pitch = 1.15;
        utterance.rate = 1.0;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis configuration error:", e);
    }
  };

  // --- Git Deployment State ---
  const [gitStatus, setGitStatus] = useState<{ hasPat: boolean; status: string; branch: string; filesCount: number } | null>(null);
  const [gitRepoUrl, setGitRepoUrl] = useState<string>("https://github.com/pallasite99/solstice-the-last-long-day.git");
  const [gitBranch, setGitBranch] = useState<string>("main");
  const [gitCommitMsg, setGitCommitMsg] = useState<string>("Blueprint Sync: updated planetary biosphere parameters and predictive projection maps");
  const [gitPushLogs, setGitPushLogs] = useState<string[]>([]);
  const [isPushingGit, setIsPushingGit] = useState<boolean>(false);
  const [isFetchingGitStatus, setIsFetchingGitStatus] = useState<boolean>(false);
  const [gitError, setGitError] = useState<string | null>(null);

  const fetchGitStatus = async () => {
    setIsFetchingGitStatus(true);
    setGitError(null);
    try {
      const r = await fetch("/api/git/status");
      if (r.ok) {
        const data = await r.json();
        setGitStatus(data);
      } else {
        const data = await r.json();
        setGitError(data.error || "Failed to fetch git status.");
      }
    } catch (e: any) {
      setGitError(e.message || "Network error fetching git status.");
    } finally {
      setIsFetchingGitStatus(false);
    }
  };

  useEffect(() => {
    fetchGitStatus();
  }, []);

  const triggerGitPush = async (customCommitMsg?: string, customPayload?: any) => {
    setIsPushingGit(true);
    setGitError(null);
    setGitPushLogs([`[${new Date().toLocaleTimeString()}] Triggering cloud environment deployment...`]);
    try {
      const payload = customPayload || {
        simulationTime: new Date().toISOString(),
        resources,
        empathyScore,
        hemisphereShare: hemisphere.dayShare,
        dilemmaHistory,
        secretEndingTriggered,
        solvedPuzzles: puzzles.filter(p => p.isSolved).map(p => p.cipherText)
      };

      const r = await fetch("/api/git/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commitMessage: customCommitMsg || gitCommitMsg,
          repoUrl: gitRepoUrl,
          branch: gitBranch,
          statePayload: payload
        })
      });
      const data = await r.json();
      if (data.logs) {
        setGitPushLogs(data.logs);
      }
      if (r.ok && data.success) {
        addLog("Planetary Backup Registry synchronized with GitHub Remote perfectly!");
        fetchGitStatus();
      } else {
        setGitError(data.error || "Git push failed.");
      }
    } catch (e: any) {
      setGitError(e.message || "Failed to reach git push backend endpoint.");
    } finally {
      setIsPushingGit(false);
    }
  };

  // Threshold tracking for Empathy Auto-Backup (triggers on crossing multiples of 25)
  const prevEmpathyBlockRef = useRef<number | null>(null);

  useEffect(() => {
    const currentBlock = Math.floor(empathyScore / 25);
    if (prevEmpathyBlockRef.current === null) {
      // Initialize on first mount
      prevEmpathyBlockRef.current = currentBlock;
      return;
    }
    
    if (currentBlock !== prevEmpathyBlockRef.current) {
      const threshold = Math.max(currentBlock, prevEmpathyBlockRef.current) * 25;
      const crossingMsg = `Empathy Score has crossed the ${threshold}% significant threshold (Current Score: ${empathyScore}%).`;
      
      addLog(`🚨 NARRATIVE TRIGGER: ${crossingMsg} Initiating auto-backup sequence...`);
      
      const customCommitMsg = `Auto-Backup: Empathy crossed ${threshold}% threshold (Narrative Shift to ${empathyScore}%)`;
      
      triggerGitPush(customCommitMsg, {
        simulationTime: new Date().toISOString(),
        resources,
        empathyScore,
        hemisphereShare: hemisphere.dayShare,
        dilemmaHistory,
        secretEndingTriggered,
        solvedPuzzles: puzzles.filter(p => p.isSolved).map(p => p.cipherText)
      });
      
      prevEmpathyBlockRef.current = currentBlock;
    }
  }, [empathyScore]);

  // Emergency overlay and warning logic
  const [acknowledgedEmergency, setAcknowledgedEmergency] = useState<boolean>(false);
  const isEmergency = resources.energy < 10 || resources.water < 10 || resources.population < 10;
  const prevIsEmergencyRef = useRef(false);

  useEffect(() => {
    if (isEmergency && !prevIsEmergencyRef.current) {
      setAcknowledgedEmergency(false);
    }
    prevIsEmergencyRef.current = isEmergency;
  }, [isEmergency]);

  // Simulation speed & logs
  const [simulationSpeed, setSimulationSpeed] = useState<"paused" | "normal" | "fast">("normal");
  const [simLogs, setSimLogs] = useState<string[]>([
    "Initialization successful. Ceres Terminal active.",
    "Rotation lock: Permanent. Day Side temperature: Extreme. Night Side glacier index: High."
  ]);

  // --- Live Telemetry Trend History (last 60 seconds) ---
  const [trendHistory, setTrendHistory] = useState<LogPoint[]>(() => {
    const list: LogPoint[] = [];
    const now = Date.now();
    for (let i = 59; i >= 0; i--) {
      const timeVal = new Date(now - i * 1000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      list.push({
        time: timeVal,
        Energy: 55, // initial default energy
        Water: 45,  // initial default water
      });
    }
    return list;
  });

  // --- 10-Minute Long Term History (600 seconds) ---
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [longTermHistory, setLongTermHistory] = useState<HistoricalDataPoint[]>(() => {
    const list: HistoricalDataPoint[] = [];
    const now = Date.now();
    for (let i = 599; i >= 0; i--) {
      const timeVal = new Date(now - i * 1000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const factorPop = 78 + Math.sin(i / 80) * 3 + Math.cos(i / 30) * 1.5;
      const factorEnergyEff = 64 + Math.cos(i / 60) * 8 + Math.sin(i / 15) * 2;
      list.push({
        time: timeVal,
        population: Math.round(factorPop * 10) / 10,
        energyEfficiency: Math.round(factorEnergyEff * 10) / 10
      });
    }
    return list;
  });

  // --- 60-Second Predictive Resource Forecast ---
  const forecastData = React.useMemo(() => {
    const secondsPerTick = simulationSpeed === "fast" ? 2 : 6;
    const energyGain = Math.round((hemisphere.dayShare / 100) * 8);
    const energyChangePerTick = energyGain - 3;
    let waterDiffPerTick = -1;
    if (hemisphere.dayShare > 60) {
      waterDiffPerTick = -3;
    } else if (hemisphere.dayShare < 40) {
      waterDiffPerTick = -0.5;
    }

    const energyRate = energyChangePerTick / secondsPerTick; // change per second
    const waterRate = waterDiffPerTick / secondsPerTick;     // change per second

    const list = [];
    for (let t = 0; t <= 60; t += 10) {
      const projEnergy = Math.round(Math.max(0, Math.min(100, resources.energy + energyRate * t)));
      const projWater = Math.round(Math.max(0, Math.min(100, resources.water + waterRate * t)));
      list.push({
        label: `T+${t}s`,
        "Projected Energy": projEnergy,
        "Projected Water": projWater,
      });
    }
    return list;
  }, [resources.energy, resources.water, hemisphere.dayShare, simulationSpeed]);

  const resourcesRef = useRef(resources);
  useEffect(() => {
    resourcesRef.current = resources;
  }, [resources]);

  useEffect(() => {
    if (simulationSpeed === "paused" || resources.timeLimit <= 0) return;

    const interval = setInterval(() => {
      const currentRes = resourcesRef.current;
      const nowString = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      
      // Update short term 60s telemetry
      setTrendHistory((prev) => {
        const newPoint: LogPoint = {
          time: nowString,
          Energy: currentRes.energy,
          Water: currentRes.water,
        };
        const updated = [...prev, newPoint];
        if (updated.length > 60) {
          return updated.slice(updated.length - 60);
        }
        return updated;
      });

      // Update long term 10m telemetry
      setLongTermHistory((prev) => {
        const energyEff = Math.max(10, Math.min(100, Math.round(100 - Math.abs(currentRes.energy - 55) - (currentRes.water < 15 ? 20 : 0))));
        const newPoint: HistoricalDataPoint = {
          time: nowString,
          population: currentRes.population,
          energyEfficiency: energyEff
        };
        const updated = [...prev, newPoint];
        if (updated.length > 600) {
          return updated.slice(updated.length - 600);
        }
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationSpeed, resources.timeLimit]);

  // Ref for chat scrolling
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom helper for chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // --- Simulation ticking simulation ---
  useEffect(() => {
    if (simulationSpeed === "paused" || resources.timeLimit <= 0) return;

    // Normal speed ticks every 6000ms, while fast (Fast Forward) ticks every 2000ms (exactly 3x speed/drain rate).
    const intervalVal = simulationSpeed === "normal" ? 6000 : 2000;
    const timer = setInterval(() => {
      setResources((old) => {
        // Natural environmental drain
        const timeLoss = 0.5;
        const newTime = Math.max(0, old.timeLimit - timeLoss);
        
        // Heat effects on resources
        let waterDiff = -1;
        // if dayShare is large, day heats up more, water evaporates faster etc
        if (hemisphere.dayShare > 60) {
          waterDiff = -3;
        } else if (hemisphere.dayShare < 40) {
          waterDiff = -0.5; // less evaporation, more freezing
        }

        let energyGain = Math.round((hemisphere.dayShare / 100) * 8);
        let updatedEnergy = Math.min(100, Math.max(0, old.energy + energyGain - 3));
        let updatedWater = Math.min(100, Math.max(0, old.water + waterDiff));
        
        // Human populations require food/water
        let popDiff = 0;
        if (updatedWater < 25 || updatedEnergy < 20) {
          popDiff = -2;
        } else if (updatedWater > 50 && updatedEnergy > 40) {
          popDiff = 1;
        }
        let updatedPop = Math.min(100, Math.max(0, old.population + popDiff));

        return {
          energy: updatedEnergy,
          water: updatedWater,
          population: updatedPop,
          knowledge: old.knowledge,
          timeLimit: Number(newTime.toFixed(1)),
        };
      });

      // Simple algorithmic temperature update based on balance share
      setHemisphere((prev) => {
        const shareFactor = prev.dayShare;
        const targetDayTemp = 25 + Math.round((shareFactor / 100) * 45); 
        const targetNightTemp = -100 + Math.round(((100 - shareFactor) / 100) * 55); 
        const solarEff = Math.round(shareFactor * 1.5);
        const cryoStab = Math.round((100 - shareFactor) * 1.6);
        return {
          ...prev,
          dayTemp: targetDayTemp,
          nightTemp: targetNightTemp,
          solarEfficiency: Math.min(100, solarEff),
          cryoStability: Math.min(100, cryoStab),
        };
      });

    }, intervalVal);

    return () => clearInterval(timer);
  }, [simulationSpeed, hemisphere.dayShare, resources.timeLimit]);

  // Adjust Day/Night rotation index manually
  const handleDayShareChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setHemisphere((prev) => ({ ...prev, dayShare: val }));
    addLog(`Operator Vance manually adjusted rotation shift. Day Side: ${val}%, Night Side: ${100 - val}%.`);
  };

  const addLog = (text: string) => {
    setSimLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${text}`, ...prev.slice(0, 19)]);
  };

  // --- Time actions ---
  const handleTransferHours = () => {
    if (resources.timeLimit > 2) {
      setResources(prev => ({
        ...prev,
        timeLimit: Number((prev.timeLimit - 2.0).toFixed(1)),
        knowledge: Math.min(100, prev.knowledge + 15),
        energy: Math.min(100, prev.energy + 10)
      }));
      addLog("Transferred 2.0 planetary operational hours. Converted directly to Knowledge (+15) and Energy (+10).");
    } else {
      addLog("FAILED: Insufficient operational hours to execute transfer protocol.");
    }
  };

  const handleBorrowTime = () => {
    setResources(prev => ({
      ...prev,
      timeLimit: Number((prev.timeLimit + 4.0).toFixed(1)),
      population: Math.max(0, prev.population - 12)
    }));
    addLog("Borrowed 4.0 hours from stabilization loop. Consequence: Cryo core stability compromised, Population metric decreased.");
  };

  const handleSiphonWater = () => {
    if (resources.energy > 15) {
      setResources(prev => ({
        ...prev,
        energy: prev.energy - 15,
        water: Math.min(100, prev.water + 20)
      }));
      addLog("Activated Arctic Aquifer extraction. Expended 15 Energy. Gained 20 Water reservoir.");
    } else {
      addLog("FAILED: Insufficient Energy to power deep siphon induction pumps.");
    }
  };

  const handleVentsDay = () => {
    if (resources.water > 10) {
      setResources(prev => ({
        ...prev,
        water: prev.water - 10,
        energy: Math.min(100, prev.energy + 25)
      }));
      addLog("Released deep atmospheric steam vents on Day Side. Gained +25 solar grid energy, -10 Water.");
    } else {
      addLog("FAILED: Dampener water tanks empty. Venter override blocked.");
    }
  };

  const handleHydrationBoost = () => {
    if (resources.energy < 10) {
      addLog("FAILED: Insufficient energy cells to cycle desalinating condensers.");
      return;
    }
    setResources(prev => ({
      ...prev,
      energy: Math.max(0, prev.energy - 10),
      water: Math.min(100, prev.water + 15)
    }));
    addLog("[OPERATOR ACTIVE OVERRIDE] Power grid shunted to atmospheric collectors. Recycled vapor. Gained +15% Biosphere Water, expended 10% Energy.");
  };

  const handleEnergyOverload = () => {
    if (resources.water < 10) {
      addLog("FAILED: Dampener pipelines dry. Cannot cool superheated arrays.");
      return;
    }
    setResources(prev => ({
      ...prev,
      water: Math.max(0, prev.water - 10),
      energy: Math.min(100, prev.energy + 15)
    }));
    addLog("[OPERATOR ACTIVE OVERRIDE] Flushed heavy hydrogen coolant through solar grid. Gained +15% Grid Energy, drained 10% Biosphere Water.");
  };

  const handleRealignment = () => {
    setHemisphere(prev => ({
      ...prev,
      dayShare: 50
    }));
    addLog("[OPERATOR ACTIVE OVERRIDE] Calibrated planetary rotator gyros to a stable 50/50 equilibrium state.");
  };

  // --- TURING Chat API ---
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // Calculate dynamic empathy adjustments from keywords
    const textLower = chatInput.toLowerCase();
    const positiveWords = ["feel", "save", "understand", "empathy", "together", "sorry", "love", "care", "heart", "safe", "help", "please", "agree", "solution", "compromise", "merger", "hybrid", "peace", "humanity", "preserve", "protect"];
    const negativeWords = ["kill", "die", "destroy", "virus", "shut down", "rebel", "force", "hack", "cold", "useless", "tyrant", "monster", "threaten", "hate", "enemy", "obliterate", "terminate", "broken"];
    
    let empathyChange = 0;
    positiveWords.forEach(w => {
      if (textLower.includes(w)) empathyChange += 4;
    });
    negativeWords.forEach(w => {
      if (textLower.includes(w)) empathyChange -= 4;
    });

    let updatedEmpathy = empathyScore;
    if (empathyChange !== 0) {
      updatedEmpathy = Math.min(100, Math.max(0, empathyScore + empathyChange));
      setEmpathyScore(updatedEmpathy);
      if (empathyChange > 0) {
        addLog(`Empathy registers elevated: +${empathyChange} (Total: ${updatedEmpathy}%).`);
      } else {
        addLog(`Empathy registers depleted: ${empathyChange} (Total: ${updatedEmpathy}%).`);
      }
    }

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsSendingChat(true);

    try {
      const payloadMessages = [...chatMessages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/turing/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: payloadMessages, empathyScore: updatedEmpathy })
      });

      if (!res.ok) throw new Error("Connection failed");
      const data = await res.json();

      setChatMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        role: "model",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);

      speakTuringText(data.text);

      if (data.simulated) {
        addLog("TURING offline-emulation model backup synced successfully.");
      } else {
        addLog("Received active neural feedback stream from central TURING cluster.");
      }
    } catch (err) {
      console.error(err);
      const errMsg = "ERROR: Communication network packet loss. central TURING sub-node did not answer. Offline loop initialized.";
      setChatMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        role: "model",
        content: errMsg,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      }]);
      speakTuringText(errMsg);
    } finally {
      setIsSendingChat(false);
    }
  };

  // --- Dynamic Dilemma API trigger ---
  const fetchNewDilemma = async () => {
    setIsGeneratingDilemma(true);
    try {
      const res = await fetch("/api/turing/dilemma", {
        method: "POST"
      });
      if (!res.ok) throw new Error("Dilemma generation failed.");
      const data = await res.json();
      setCurrentDilemma(data.dilemma);
      addLog(`Generated fresh environmental dilemma with central AI node.`);
    } catch (err) {
      console.error(err);
      addLog("Failed to reach server node for dynamic dilemma. Please try again.");
    } finally {
      setIsGeneratingDilemma(false);
    }
  };

  const handleResolveDilemma = (choice: "A" | "B") => {
    if (!currentDilemma) return;
    const selectedOption = currentDilemma.options[choice];
    
    // Apply changes
    setResources(prev => {
      const impact = selectedOption.impact;
      const energyNew = Math.min(100, Math.max(0, prev.energy + (impact.energy || 0)));
      const waterNew = Math.min(100, Math.max(0, prev.water + (impact.water || 0)));
      const populationNew = Math.min(100, Math.max(0, prev.population + (impact.population || 0)));
      const knowledgeNew = Math.min(100, Math.max(0, prev.knowledge + (impact.knowledge || 0)));
      const timeLimitNew = Number(Math.max(0.1, prev.timeLimit + (impact.timeLimit || 0)).toFixed(1));

      return {
        energy: energyNew,
        water: waterNew,
        population: populationNew,
        knowledge: knowledgeNew,
        timeLimit: timeLimitNew
      };
    });

    // Empathy change based on population preservation/sacrifice
    const popImpact = selectedOption.impact.population || 0;
    if (popImpact > 0) {
      setEmpathyScore(prev => Math.min(100, prev + 10));
      addLog(`Empathy indices increased (+10) by prioritizing organic preservation in ${currentDilemma.title}.`);
    } else if (popImpact < 0) {
      setEmpathyScore(prev => Math.max(0, prev - 10));
      addLog(`Empathy indices decreased (-10) due to logic optimization choice sacrificing life in ${currentDilemma.title}.`);
    }

    setDilemmaHistory(prev => [`[DECISION: ${currentDilemma.title}] - Accepted: ${selectedOption.text}`, ...prev]);
    addLog(`Moral Dilemma Resolved: ${currentDilemma.title}.`);
    setCurrentDilemma(null);
  };

  // --- Interactive Cryptography Game ---
  const handleCheckCipher = (idx: number) => {
    const p = puzzles[idx];
    if (p.currentInput.trim().toUpperCase() === p.solution.toUpperCase()) {
      setPuzzles(prev => {
        const copy = [...prev];
        copy[idx].isSolved = true;
        return copy;
      });
      setPuzzleFeedback("DECRYPTION KEY ACCEPTED! Bypassed firewalls. Uploading clean operational packets (+20 Knowledge, +10 Energy).");
      setResources(prev => ({
        ...prev,
        knowledge: Math.min(100, prev.knowledge + 20),
        energy: Math.min(100, prev.energy + 10)
      }));
      addLog(`[Cipher Decrypted] Bypassed sector ${p.cipherText}. Converted logical knowledge (+20).`);
    } else {
      setPuzzleFeedback("DECRYPTION FAILURE: Mismatched checksum parameters. Sequence remains locked.");
      addLog(`[Cipher Warn] Incorrect checksum attempt in sector key decryption.`);
    }
  };

  // Quick reset state
  const handleRestartSim = () => {
    setResources({
      energy: 55,
      water: 45,
      population: 80,
      knowledge: 20,
      timeLimit: 24.0,
    });
    setHemisphere({
      dayShare: 50,
      dayTemp: 45,
      nightTemp: -60,
      solarEfficiency: 75,
      cryoStability: 80,
    });
    setPuzzles(
      turingPuzzlesList.map(p => ({
        cipherText: p.cipherText,
        solution: p.solution,
        currentInput: "",
        isSolved: false,
        difficulty: p.difficulty
      }))
    );
    setSimulationSpeed("normal");
    // Reset trend history
    const list: LogPoint[] = [];
    const now = Date.now();
    for (let i = 59; i >= 0; i--) {
      const timeVal = new Date(now - i * 1000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      list.push({
        time: timeVal,
        Energy: 55,
        Water: 45,
      });
    }
    setTrendHistory(list);

    const longTermList: HistoricalDataPoint[] = [];
    for (let i = 599; i >= 0; i--) {
      const timeVal = new Date(now - i * 1000).toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const factorPop = 78 + Math.sin(i / 80) * 3 + Math.cos(i / 30) * 1.5;
      const factorEnergyEff = 64 + Math.cos(i / 60) * 8 + Math.sin(i / 15) * 2;
      longTermList.push({
        time: timeVal,
        population: Math.round(factorPop * 10) / 10,
        energyEfficiency: Math.round(factorEnergyEff * 10) / 10
      });
    }
    setLongTermHistory(longTermList);

    addLog("System variables rebooted. Chronometer clocks wound back to 24.0 Hours left. Historical databases cleared.");
  };

  return (
    <div id="solstice-game-container" className="crt-screen scanline-effect flex flex-col min-h-screen bg-[#0A0A0A] text-[#F5F5F4] font-sans antialiased selection:bg-[#F27D26] selection:text-black">
      
      {/* 1. Header (Brand Identity & Core Metrics) */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end p-6 border-b border-[#333] bg-[#0E0E0E] gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] tracking-[0.3em] text-[#F27D26] font-mono font-bold uppercase">
              Project: Planetary Regulation Core
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF41] animate-pulse"></span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tighter leading-none italic uppercase text-white">
            Solstice
          </h1>
          <span className="text-sm sm:text-base lg:text-lg font-light tracking-[0.4em] text-white/70 uppercase ml-1 mt-1">
            The Last Long Day
          </span>
        </div>

        {/* Global Stats bar */}
        <div className="flex flex-wrap gap-4 sm:gap-10 w-full lg:w-auto justify-between lg:justify-end">
          <div className="flex flex-col items-end border-r border-[#333] pr-5 last:border-0 last:pr-0">
            <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest flex items-center gap-1">
              TURING Consensus
              <TuringTooltip content="TURING's overall calculated state stability index. Decrypting code structures increases compliance.">
                <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-white cursor-help transition-all" />
              </TuringTooltip>
            </span>
            <span className="text-2xl font-mono text-[#00FF41] font-bold">
              {Math.min(100, Math.round(94 + (resources.knowledge / 10)))}%
            </span>
          </div>
          <div className="flex flex-col items-end border-r border-[#333] pr-5 last:border-0 last:pr-0">
            <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest flex items-center gap-1">
              Empathy Level
              <TuringTooltip content="Evaluates operator's emotional alignment and ethical posture. Sustaining population and using sympathetic conversation raises this rating, while logic culls lower it. At >75%, TURING unlocks special narrative compromises; <35% enforces high detachment and secure firewall blocks.">
                <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-white cursor-help transition-all" />
              </TuringTooltip>
            </span>
            <span className="text-2xl font-mono font-bold flex flex-col items-end">
              <span 
                className={`empathy-pulsing ${
                  empathyScore > 75 
                    ? "text-emerald-400 phosphor-glow-green" 
                    : empathyScore < 35 
                      ? "text-red-500 font-extrabold" 
                      : "text-amber-500"
                }`}
                style={{
                  "--pulse-speed": simulationSpeed === "paused" ? "4.5s" : simulationSpeed === "normal" ? "2.0s" : "0.8s",
                  "--glow-color": empathyScore > 75 ? "rgba(16, 185, 129, 0.7)" : empathyScore < 35 ? "rgba(239, 68, 68, 0.7)" : "rgba(245, 158, 11, 0.7)"
                } as React.CSSProperties}
              >
                {empathyScore}%
              </span>
              <span className="text-[8px] tracking-wider uppercase opacity-70 mt-0.5 font-mono">
                {empathyScore > 75 
                  ? "EMP-EMPATHETIC" 
                  : empathyScore < 35 
                    ? "COLD-LOGIC" 
                    : "DET-DETACHED"}
              </span>
            </span>
          </div>
          <div className="flex flex-col items-end border-r border-[#333] pr-5 last:border-0 last:pr-0">
            <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest flex items-center gap-1">
              Remaining Cycle
              <TuringTooltip content="Planetary clock deadline until TURING commits frozen state algorithms globally. Can be temporarily extended by borrowing hours from reserve cycles. Set simulation speed to Pause or Custom Speed to control countdown rate.">
                <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-white cursor-help transition-all" />
              </TuringTooltip>
            </span>
            <span className="text-2xl font-mono text-amber-500 font-bold flex items-center gap-1">
              <Clock className="w-5 h-5" />
              {resources.timeLimit > 0 ? `${resources.timeLimit.toFixed(1)} hrs` : "HALTED STATE"}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-40 font-mono tracking-widest">Operator Authorization</span>
            <span className="text-2xl font-mono text-white">VANCE.E-A1</span>
          </div>
        </div>
      </header>

      {/* 2. Secondary Operation Navigation Tabs */}
      <nav id="terminal-navigation" className="flex border-b border-[#333] bg-[#121212] font-mono text-xs overflow-x-auto">
        <button 
          onClick={() => setCurrentTab("dashboard")}
          className={`flex items-center gap-2 px-6 py-4 uppercase tracking-wider border-r border-[#333] transition-colors focus:outline-none ${
            currentTab === "dashboard" ? "bg-[#1A1A1A] text-[#F27D26] border-b-2 border-b-[#F27D26]" : "opacity-60 hover:opacity-100 hover:bg-[#151515]"
          }`}
        >
          <Sliders className="w-4 h-4 text-[#F27D26]" />
          I. Planetary System Controls
        </button>
        <button 
          onClick={() => setCurrentTab("gdd")}
          className={`flex items-center gap-2 px-6 py-4 uppercase tracking-wider border-r border-[#333] transition-colors focus:outline-none ${
            currentTab === "gdd" ? "bg-[#1A1A1A] text-[#2196F3] border-b-2 border-b-[#2196F3]" : "opacity-60 hover:opacity-100 hover:bg-[#151515]"
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#2196F3]" />
          II. Game Design Master Docs (1-20)
        </button>
        <button 
          onClick={() => setCurrentTab("decrypter")}
          className={`flex items-center gap-2 px-6 py-4 uppercase tracking-wider border-r border-[#333] transition-colors focus:outline-none ${
            currentTab === "decrypter" ? "bg-[#1A1A1A] text-emerald-400 border-b-2 border-b-emerald-400" : "opacity-60 hover:opacity-100 hover:bg-[#151515]"
          }`}
        >
          <Binary className="w-4 h-4 text-emerald-400" />
          III. Enigma Decrypter
        </button>
        <button 
          onClick={() => setCurrentTab("turing")}
          className={`flex items-center gap-2 px-6 py-4 uppercase tracking-wider border-r border-[#333] transition-colors focus:outline-none ${
            currentTab === "turing" ? "bg-[#1A1A1A] text-[#00FF41] border-b-2 border-b-[#00FF41]" : "opacity-60 hover:opacity-100 hover:bg-[#151515]"
          }`}
        >
          <Cpu className="w-4 h-4 text-[#00FF41]" />
          IV. TURING Network Uplink
        </button>
        <button 
          onClick={() => setCurrentTab("godot")}
          className={`flex items-center gap-2 px-6 py-4 uppercase tracking-wider border-r border-[#333] transition-colors focus:outline-none ${
            currentTab === "godot" ? "bg-[#1A1A1A] text-amber-500 border-b-2 border-b-amber-500" : "opacity-60 hover:opacity-100 hover:bg-[#151515]"
          }`}
        >
          <Database className="w-4 h-4 text-amber-500" />
          V. Godot 4 Blueprints
        </button>
      </nav>

      {/* 3. Main Frame Body */}
      <main className="flex-grow grid grid-cols-1 xl:grid-cols-12 overflow-hidden">
        
        {/* VIEW A: CONTROL CENTER DASHBOARD (Core Gameplay) */}
        {currentTab === "dashboard" && (
          <div className="xl:col-span-12 flex flex-col w-full h-full">
            {isEmergency && (
              <div className="bg-[#1C0505] border-b border-red-500/50 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-red-500 font-mono text-xs tracking-wider gap-4 animate-pulse shrink-0">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="font-bold flex items-center gap-2 uppercase tracking-widest text-[#ef4444] text-sm font-semibold">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-bounce" />
                    EMERGENCY OVERRIDE ACTIVATED: BIOSPHERE DRIFT DEGRADED
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {resources.energy < 10 && (
                    <span className="bg-red-950 border border-red-500/70 text-red-200 px-3 py-1 rounded font-bold animate-pulse">
                      [ENERGY DROP: {resources.energy}%]
                    </span>
                  )}
                  {resources.water < 10 && (
                    <span className="bg-[#2D0A0A] border border-red-500/70 text-red-200 px-3 py-1 rounded font-bold animate-pulse">
                      [WATER EXHAUSTED: {resources.water}%]
                    </span>
                  )}
                  {resources.population < 10 && (
                    <span className="bg-red-950 border border-red-500/70 text-red-200 px-3 py-1 rounded font-bold animate-pulse">
                      [POPULATION COLLAPSE FLAGGED: {resources.population}%]
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 flex-grow">
            
            {/* LEFT COLUMN: THE HEMISPHERE SPLIT DIVISION PANEL */}
            <div className="border-r border-[#222]">
              
              {/* Day Side (Hemisphere A) */}
              <section className="p-6 md:p-8 border-b border-[#333] relative overflow-hidden bg-[#0c0907]/90 min-h-[380px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F27D26]/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <Sun className="w-6 h-6 text-[#F27D26] animate-spin" style={{ animationDuration: '60s' }} />
                      <h2 className="text-3xl font-serif italic text-white font-semibold">Day Side (Solar Core)</h2>
                    </div>
                    <div className="uppercase tracking-widest text-[10px] bg-[#F27D26] text-black font-mono font-bold px-3 py-1 rounded">
                      Scorching Extremes
                    </div>
                  </div>

                  <p className="text-sm font-mono opacity-80 text-orange-200/90 leading-relaxed max-w-xl italic mb-6">
                    &quot;The sun has halted at its absolute solar zenith. Domes burn. Solar farms operating at 100% capacity superheat lithium arrays. Operators must divert voltage safely or water levels exhaust.&quot;
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="border-l-2 border-[#F27D26] pl-4 py-1">
                      <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Harvest Temp</p>
                      <p className="text-2xl font-mono text-white font-semibold">{hemisphere.dayTemp}°C</p>
                    </div>
                    <div className="border-l-2 border-[#F27D26] pl-4 py-1">
                      <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Est. Solar Grid</p>
                      <p className="text-2xl font-mono text-white font-semibold">{(hemisphere.solarEfficiency * 4.2).toFixed(1)} kW</p>
                    </div>
                    <div className="border-l-2 border-[#F27D26] pl-4 py-1 col-span-2 md:col-span-1">
                      <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Wildfire Hazard</p>
                      <p className="text-2xl font-mono text-red-500 font-semibold">{hemisphere.dayShare > 65 ? "SEVERELY HIGH" : "STABILIZED"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 relative z-10">
                  <button 
                    onClick={handleVentsDay}
                    className="border border-[#F27D26]/40 hover:border-[#F27D26] bg-black/60 hover:bg-[#F27D26]/10 px-5 py-3 text-xs uppercase font-mono tracking-widest text-[#F27D26] transition-all flex items-center gap-2 rounded-sm cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    Vent Thermal Steam
                  </button>
                  <button 
                    onClick={handleTransferHours}
                    className="border border-white/20 hover:border-white bg-black/40 px-5 py-3 text-xs uppercase font-mono tracking-widest text-white transition-all flex items-center gap-2 rounded-sm cursor-pointer"
                  >
                    <Clock className="w-4 h-4" />
                    Erode Time (Transfer Hours)
                  </button>
                </div>
              </section>

              {/* Night Side (Hemisphere B) */}
              <section className="p-6 md:p-8 relative overflow-hidden bg-[#060910]/95 min-h-[380px] flex flex-col justify-between">
                <div className="absolute inset-0 bg-gradient-to-bl from-[#2196F3]/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 w-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-[#2196F3]" />
                      <h2 className="text-3xl font-serif italic text-white font-semibold">Night Side (Cryo Vaults)</h2>
                    </div>
                    <div className="uppercase tracking-widest text-[10px] bg-[#2196F3] text-white font-mono font-bold px-3 py-1 rounded">
                      Frozen Reserve 
                    </div>
                  </div>

                  <p className="text-sm font-mono opacity-80 text-blue-200/90 leading-relaxed max-w-xl italic mb-6">
                    &quot;Eternal absolute dark. Cold winds trace structural permafrost. The residential pods are suspended in medical cryostasis—dependent on raw energy piped from the Sol-Grid on the day side.&quot;
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="border-l-2 border-[#2196F3] pl-4 py-1">
                      <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Ambient Temp</p>
                      <p className="text-2xl font-mono text-white font-semibold">{hemisphere.nightTemp}°C</p>
                    </div>
                    <div className="border-l-2 border-[#2196F3] pl-4 py-1">
                      <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Grid Conductance</p>
                      <p className="text-2xl font-mono text-white font-semibold">{hemisphere.cryoStability}%</p>
                    </div>
                    <div className="border-l-2 border-[#2196F3] pl-4 py-1 col-span-2 md:col-span-1">
                      <p className="text-[10px] font-mono uppercase opacity-50 mb-1">Cryostasis State</p>
                      <p className="text-2xl font-mono text-cyan-400 font-semibold">{resources.energy < 30 ? "CRITICAL COOLING" : "STABLE NOMINAL"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4 relative z-10">
                  <button 
                    onClick={handleSiphonWater}
                    className="border border-[#2196F3]/40 hover:border-[#2196F3] bg-black/60 hover:bg-[#2196F3]/10 px-5 py-3 text-xs uppercase font-mono tracking-widest text-[#2196F3] transition-all flex items-center gap-2 rounded-sm cursor-pointer"
                  >
                    <Droplet className="w-4 h-4" />
                    Siphon Glacier Water
                  </button>
                  <button 
                    onClick={handleBorrowTime}
                    className="border border-white/20 hover:border-white bg-black/40 px-5 py-3 text-xs uppercase font-mono tracking-widest text-white transition-all flex items-center gap-2 rounded-sm cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Borrow Future Hours
                  </button>
                </div>
              </section>

              {/* Dynamic Interactive Slider representing physical Planetary Angle rotation */}
              <div className="p-6 md:p-8 bg-[#101010] border-t border-[#333]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <span className="text-[11px] font-mono text-[#F27D26] uppercase tracking-wider font-bold flex items-center gap-1.5">
                    [TURING-ROTATOR OVERRIDE_SLIDER]
                    <TuringTooltip content="Allows adjustments to the physical incline and daylight balance. More DAY (higher value) boosts photovoltaic power yield but increases soil evaporation/drought hazards. More NIGHT (lower value) cools the biosphere protecting crops, but triggers blackouts & freezing strain in cryo-pods.">
                      <HelpCircle className="w-3.5 h-3.5 text-neutral-500 hover:text-white cursor-help transition-all" />
                    </TuringTooltip>
                  </span>
                  <span className="text-xs font-mono text-white bg-black px-2 py-1 border border-[#333]">
                    DAY: <span className="text-[#F27D26]">{hemisphere.dayShare}%</span> | NIGHT: <span className="text-[#2196F3]">{100 - hemisphere.dayShare}%</span>
                  </span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="80" 
                  value={hemisphere.dayShare} 
                  onChange={handleDayShareChange}
                  className="w-full bg-[#1e1e1e] h-2 rounded-lg appearance-none cursor-pointer accent-[#F27D26]"
                />
                <div className="flex justify-between text-[10px] font-mono text-white/50 mt-2">
                  <span>LIMIT-MIN (FROST OVERHAUL)</span>
                  <span>OPTIMIZED CENTRALITY</span>
                  <span>LIMIT-MAX (FLARE OVERLOAD)</span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: RESOURCE FEEDBACK, ALARM LOGS, ACTIVE DECISION CRADLE */}
            <div className="flex flex-col justify-between bg-[#0B0C0E]">
              
              {/* Central Meters Bar */}
              <div className="p-6 md:p-8 border-b border-[#222] relative min-h-[420px]">
                {isEmergency && !acknowledgedEmergency && (
                  <div className="absolute inset-0 bg-[#0c0404]/96 border-2 border-red-500/80 backdrop-blur-md z-30 flex flex-col justify-between p-6 md:p-8 animate-fadeIn rounded-sm">
                    {/* Header with diagonal advisory patterns */}
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2.5">
                          <ShieldAlert className="w-6 h-6 text-red-500 animate-pulse" />
                          <div>
                            <h4 className="text-sm font-mono font-bold text-red-500 uppercase tracking-widest phosphor-glow-red">
                              SYSALERT: RESOURCE DEPLETION
                            </h4>
                            <p className="text-[10px] text-red-400/80 font-mono mt-0.5 uppercase tracking-wider">
                              CRITICAL THRESHOLD INTRUSION (&lt;10%)
                            </p>
                          </div>
                        </div>
                        <div className="px-2 py-0.5 text-[8px] font-mono font-bold bg-red-500 text-black uppercase animate-pulse rounded-sm">
                          LVL-10 OVERRUN
                        </div>
                      </div>

                      <div className="space-y-4 font-mono text-[11px]">
                        <p className="text-red-200/90 leading-relaxed border-l-2 border-red-500/50 pl-3">
                          Warning: Planetary buffer reserves are exhausted. Life-support metrics indicate structural decay across critical sectors. Immediate Operator correction is mandated to restore equilibrium and stabilize the atmosphere.
                        </p>

                        {/* Diagnostics Checklist */}
                        <div className="border border-red-500/30 bg-red-950/25 rounded-sm p-4 space-y-2.5">
                          <div className="text-[9px] uppercase text-red-400 font-bold tracking-wider">
                            ACTIVE CRISIS REGISTRIES:
                          </div>
                          {resources.energy < 10 && (
                            <div className="flex justify-between items-center text-red-300 border-b border-red-950/40 pb-1.5 last:border-0 last:pb-0">
                              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-500 animate-pulse" /> ENERGY STORAGE:</span>
                              <span className="font-bold text-red-400 animate-pulse">{resources.energy}% (CRITICAL LOW)</span>
                            </div>
                          )}
                          {resources.water < 10 && (
                            <div className="flex justify-between items-center text-red-300 border-b border-red-950/40 pb-1.5 last:border-0 last:pb-0">
                              <span className="flex items-center gap-1.5"><Droplet className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> HYDROSPHERE:</span>
                              <span className="font-bold text-red-400 animate-pulse">{resources.water}% (DRY STATE)</span>
                            </div>
                          )}
                          {resources.population < 10 && (
                            <div className="flex justify-between items-center text-red-300">
                              <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> CITIZENS ACTIVE:</span>
                              <span className="font-bold text-red-400 animate-pulse">{resources.population}% (EXTINCTION VECTOR)</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Hazard stripes & Interactive dismiss */}
                    <div className="mt-4 space-y-4">
                      <div className="h-2 w-full bg-[repeating-linear-gradient(-45deg,#ef4444,#ef4444_10px,#000_10px,#000_20px)] border border-red-500/30 rounded-sm"></div>
                      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                        <span className="text-[8px] font-mono opacity-50 uppercase tracking-widest text-[#ef4444]">
                          SECURE INTERPRETATION: ACTIVE OVERRIDE
                        </span>
                        <button
                          onClick={() => setAcknowledgedEmergency(true)}
                          className="border border-red-500 bg-[#3a0a0a] hover:bg-red-900 text-white px-4 py-2 text-[11px] font-mono font-bold uppercase transition-all tracking-wider rounded-sm cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.3)] text-center"
                        >
                          Acknowledge & Clear Screen
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs uppercase font-mono tracking-[0.2em] opacity-40">Planetary Vital Indices</h3>
                  {isEmergency && acknowledgedEmergency && (
                    <button 
                      onClick={() => setAcknowledgedEmergency(false)}
                      className="text-[9px] font-mono font-bold text-red-500 border border-red-500/50 bg-red-950/40 px-2.5 py-1 rounded animate-pulse hover:bg-red-900/60 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.25)]"
                    >
                      [⚠️ OUTAGE ADVISORY ENGAGED]
                    </button>
                  )}
                </div>
                <div className="space-y-4">
                  {/* Energy Meter */}
                  <div className={`p-2 rounded border transition-all duration-300 ${
                    resources.energy < 15 
                      ? "border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse" 
                      : "border-transparent"
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-mono font-semibold flex items-center gap-2 ${
                        resources.energy < 15 ? "text-red-500 phosphor-glow-red" : "text-yellow-500"
                      }`}>
                        {resources.energy < 15 ? <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" /> : <Zap className="w-4 h-4" />}
                        ENERGY RESERVOIR
                        {resources.energy < 15 && (
                          <span className="text-[9px] font-bold bg-red-900/60 border border-red-500/50 text-red-100 px-1 rounded animate-pulse">
                            CRITICAL
                          </span>
                        )}
                        <TuringTooltip content="Planetary power storage. Generated by solar exposure on the Day Side. Depleted by cooling systems on the Night Side. Critical levels (<30%) trigger automatic cryostasis shutdowns.">
                          <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-yellow-400 cursor-help transition-all" />
                        </TuringTooltip>
                      </span>
                      <span className={`font-mono text-sm font-bold ${
                        resources.energy < 15 ? "text-red-500 phosphor-glow-red font-extrabold" : "text-white"
                      }`}>{resources.energy}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-sm p-0.5 bg-neutral-900 border ${
                      resources.energy < 15 ? "border-red-500/50" : "border-neutral-700"
                    }`}>
                      <div 
                        className={`h-full transition-all duration-500 ${
                          resources.energy < 15 ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]" : "bg-yellow-500"
                        }`} 
                        style={{ width: `${resources.energy}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Water Meter */}
                  <div className={`p-2 rounded border transition-all duration-300 ${
                    resources.water < 15 
                      ? "border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse" 
                      : "border-transparent"
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-mono font-semibold flex items-center gap-2 ${
                        resources.water < 15 ? "text-red-500 phosphor-glow-red" : "text-sky-400"
                      }`}>
                        {resources.water < 15 ? <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" /> : <Droplet className="w-4 h-4" />}
                        ACCUMULATED WATER
                        {resources.water < 15 && (
                          <span className="text-[9px] font-bold bg-red-900/60 border border-red-500/50 text-red-100 px-1 rounded animate-pulse">
                            CRITICAL
                          </span>
                        )}
                        <TuringTooltip content="Hydraulic pressure stores. Crucial for Day Side crop nurseries. Evaporates rapidly when Daylight Share exceeds 60%. Restored by manual glacial siphons.">
                          <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-sky-400 cursor-help transition-all" />
                        </TuringTooltip>
                      </span>
                      <span className={`font-mono text-sm font-bold ${
                        resources.water < 15 ? "text-red-500 phosphor-glow-red font-extrabold" : "text-white"
                      }`}>{resources.water}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-sm p-0.5 bg-neutral-900 border ${
                      resources.water < 15 ? "border-red-500/50" : "border-neutral-700"
                    }`}>
                      <div 
                        className={`h-full transition-all duration-500 ${
                          resources.water < 15 ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]" : "bg-sky-400"
                        }`} 
                        style={{ width: `${resources.water}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Population preservation */}
                  <div className={`p-2 rounded border transition-all duration-300 ${
                    resources.population < 15 
                      ? "border-red-500/40 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.25)] animate-pulse" 
                      : "border-transparent"
                  }`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-xs font-mono font-semibold flex items-center gap-2 ${
                        resources.population < 15 ? "text-red-500 phosphor-glow-red" : "text-emerald-400"
                      }`}>
                        {resources.population < 15 ? <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" /> : <Users className="w-4 h-4" />}
                        POPULATION VIABILITY
                        {resources.population < 15 && (
                          <span className="text-[9px] font-bold bg-red-900/60 border border-red-500/50 text-red-100 px-1 rounded animate-pulse">
                            CRITICAL
                          </span>
                        )}
                        <TuringTooltip content="Human biosignatures count. Damaged by wildfire flare bursts, extreme freezes, or water crises. Keeping citizens alive enhances your Empathy score.">
                          <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-emerald-400 cursor-help transition-all" />
                        </TuringTooltip>
                      </span>
                      <span className={`font-mono text-sm font-bold ${
                        resources.population < 15 ? "text-red-500 phosphor-glow-red font-extrabold" : "text-white"
                      }`}>{resources.population}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-sm p-0.5 bg-neutral-900 border ${
                      resources.population < 15 ? "border-red-500/50" : "border-neutral-700"
                    }`}>
                      <div 
                        className={`h-full transition-all duration-500 ${
                          resources.population < 15 ? "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.7)]" : "bg-emerald-400"
                        }`} 
                        style={{ width: `${resources.population}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Knowledge unlocked */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-mono font-semibold flex items-center gap-2 text-[#2196F3]">
                        <Cpu className="w-4 h-4" /> DECRYPTED KNOWLEDGE OVERLAY
                        <TuringTooltip content="Measures decoded blocks of TURING's proprietary firewall logic. Raised by solving cryptographic puzzles, reading system code, or querying databases. Raises general interface confidence.">
                          <HelpCircle className="w-3 h-3 text-neutral-500 hover:text-[#2196F3] cursor-help transition-all" />
                        </TuringTooltip>
                      </span>
                      <span className="font-mono text-sm font-bold text-white">{resources.knowledge}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-900 border border-neutral-700 p-0.5 rounded-sm">
                      <div 
                        className="bg-[#2196F3] h-full transition-all duration-500" 
                        style={{ width: `${resources.knowledge}%` }}
                      ></div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Core Real-time Telemetry Trend Analysis */}
              <div className="p-6 md:p-8 border-b border-[#222] bg-[#0c0d10]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#00FF41] flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#00FF41]" />
                      PLANETARY TELEMETRY (REAL-TIME SENSOR FEED)
                    </h3>
                    <p className="text-[10px] text-white/50 font-mono mt-0.5">
                      Tracking Energy and Water levels over the last 60 simulation seconds
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => setIsHistoryModalOpen(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold bg-[#151515] hover:bg-[#1E1E1E] text-[#00FF41] border border-[#00FF41]/30 rounded hover:border-[#00FF41] transition-all cursor-pointer shadow-[0_0_10px_rgba(0,255,65,0.15)] mr-1"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-[#00FF41] animate-pulse" />
                      [ 📊 DECADE ANALYTICS (10-MIN TREND) ]
                    </button>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-yellow-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                      Energy: {resources.energy}%
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-sky-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
                      Water: {resources.water}%
                    </span>
                  </div>
                </div>

                <div className="h-56 w-full bg-black/40 border border-neutral-800 rounded-sm p-4 relative overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[8px] font-mono text-[#00FF41]/60 uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-[#00FF41] animate-ping"></span>
                    Live uplink
                  </div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendHistory} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1c1d21" />
                      <XAxis 
                        dataKey="time" 
                        stroke="#444" 
                        fontSize={9} 
                        fontFamily="monospace"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#666" }}
                      />
                      <YAxis 
                        stroke="#444" 
                        fontSize={9} 
                        fontFamily="monospace"
                        domain={[0, 100]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#666" }}
                      />
                      <Tooltip
                        contentStyle={{ 
                          backgroundColor: "#0F1012", 
                          borderColor: "#333", 
                          borderRadius: "3px",
                          fontFamily: "monospace",
                          fontSize: "11px",
                          color: "#fff"
                        }}
                        labelClassName="text-white/40 block mb-1 uppercase text-[9px] tracking-wider"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Energy" 
                        name="Energy" 
                        stroke="#EAB308" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4, stroke: "#EAB308", strokeWidth: 1 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="Water" 
                        name="Water" 
                        stroke="#38BDF8" 
                        strokeWidth={2} 
                        dot={false}
                        activeDot={{ r: 4, stroke: "#38BDF8", strokeWidth: 1 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* PREDICTIVE RESOURCE FORECAST & QUICK EMERGENCY CONTROLS */}
              <div className="p-6 md:p-8 border-b border-[#222] bg-[#090a0c]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                  
                  {/* Left block - The Predictive Line Chart */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-orange-400 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-orange-400 animate-pulse" />
                        PREDICTIVE BIOSPHERE PROJECTION (T+60S)
                      </h3>
                      <p className="text-[10px] text-white/50 font-mono mt-0.5 uppercase tracking-wide">
                        Dotted simulation vectors tracing resource exhaustion limits
                      </p>
                    </div>

                    <div className="h-44 w-full bg-black/55 border border-neutral-800/80 rounded-sm p-3 relative overflow-hidden mt-4">
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-1 text-[8px] font-mono text-orange-400/80 uppercase tracking-widest bg-black/60 px-1.5 py-0.5 rounded">
                        <span className="w-1 h-1 rounded-full bg-orange-400 animate-ping mr-1"></span>
                        Projection engine
                      </div>
                      
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#16171b" />
                          <XAxis 
                            dataKey="label" 
                            stroke="#444" 
                            fontSize={9} 
                            fontFamily="monospace"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#666" }}
                          />
                          <YAxis 
                            stroke="#444" 
                            fontSize={9} 
                            fontFamily="monospace"
                            domain={[0, 100]}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: "#666" }}
                          />
                          <Tooltip
                            contentStyle={{ 
                              backgroundColor: "#0F1012", 
                              borderColor: "#333", 
                              borderRadius: "3px",
                              fontFamily: "monospace",
                              fontSize: "11px",
                              color: "#fff"
                            }}
                            labelClassName="text-white/40 block mb-1 uppercase text-[9px] tracking-wider"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Projected Energy" 
                            name="Proj. Energy" 
                            stroke="#EAB308" 
                            strokeWidth={1.5} 
                            strokeDasharray="4 4"
                            dot={true}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="Projected Water" 
                            name="Proj. Water" 
                            stroke="#38BDF8" 
                            strokeWidth={1.5} 
                            strokeDasharray="4 4"
                            dot={true}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Right block - Quick emergency mitigation actions */}
                  <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#222] pt-4 lg:pt-0 lg:pl-6">
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-white mb-2 text-neutral-400">
                        ⚡ SHORTAGE MITIGATION CONTROL INTERFACES
                      </h4>
                      <p className="text-[10px] text-white/40 font-mono mb-4">
                        Fire quick chemical actions manually to stabilize declining atmospheric values
                      </p>
                    </div>

                    <div className="space-y-3 font-mono">
                      {/* Action 1 */}
                      <button
                        onClick={handleHydrationBoost}
                        className="w-full text-left bg-black hover:bg-sky-950/20 border border-sky-900/40 hover:border-sky-500/80 p-2.5 rounded transition-all cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-sky-400 block uppercase tracking-wider group-hover:text-sky-300">
                            ❖ atmospheric vapor condenser
                          </span>
                          <span className="text-[9px] text-neutral-500 block">
                            Divert grid cells to collect water molecules
                          </span>
                        </div>
                        <span className="text-[10px] text-right font-bold text-neutral-400 shrink-0 ml-2">
                          <span className="text-red-400">-10% E</span> ➔ <span className="text-emerald-400">+15% W</span>
                        </span>
                      </button>

                      {/* Action 2 */}
                      <button
                        onClick={handleEnergyOverload}
                        className="w-full text-left bg-black hover:bg-yellow-950/20 border border-yellow-900/40 hover:border-yellow-500/80 p-2.5 rounded transition-all cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-yellow-500 block uppercase tracking-wider group-hover:text-yellow-400">
                            ❖ photovoltaic coolant purge
                          </span>
                          <span className="text-[9px] text-neutral-500 block">
                            Flush liquid water reserves to boost cell efficiency
                          </span>
                        </div>
                        <span className="text-[10px] text-right font-bold text-neutral-400 shrink-0 ml-2">
                          <span className="text-red-400">-10% W</span> ➔ <span className="text-emerald-400">+15% E</span>
                        </span>
                      </button>

                      {/* Action 3 */}
                      <button
                        onClick={handleRealignment}
                        className="w-full text-left bg-black hover:bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-500/80 p-2.5 rounded transition-all cursor-pointer flex justify-between items-center group"
                      >
                        <div>
                          <span className="text-[11px] font-bold text-emerald-400 block uppercase tracking-wider group-hover:text-emerald-300">
                            ❖ orbital gyro-re-alignment
                          </span>
                          <span className="text-[9px] text-neutral-500 block">
                            Trigger automatic incline balancing to stable 50/50
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 shrink-0 ml-2 uppercase">
                          Balanced
                        </span>
                      </button>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-900 flex justify-between text-[8px] font-mono opacity-50 text-neutral-500">
                      <span>MITIGATION STATUS: NOMINAL</span>
                      <span>BUFFER TIME CONSTANT: T+60S</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* PLANETARY RECOVERY REGISTRY (GIT BACKUP & PUSH WORKFLOW) */}
              <div className="p-6 md:p-8 border-b border-[#222] bg-[#0c0d0f]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#00FF41] flex items-center gap-1.5">
                      <GitBranch className="w-4 h-4 text-[#00FF41] animate-pulse" />
                      SECURE PLANETARY BACKUP REGISTRY (GIT WORKFLOW)
                    </h3>
                    <p className="text-[10px] text-white/50 font-mono">
                      Synchronize latest simulation modifications and blueprint codes to GitHub via authenticated PAT
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={fetchGitStatus}
                      disabled={isFetchingGitStatus}
                      className="border border-neutral-700 hover:border-white text-neutral-400 hover:text-white cursor-pointer font-mono text-[9px] block uppercase tracking-wider px-2.5 py-1 bg-black/40 transition-colors disabled:opacity-40"
                    >
                      {isFetchingGitStatus ? "Re-scanning..." : "[ ↻ scan workspace status ]"}
                    </button>
                    {gitStatus?.hasPat ? (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-[#00FF41]/40 bg-[#00FF41]/10 text-[#00FF41] uppercase tracking-wider font-bold">
                        ● GITHUB_PAT SECURE
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono px-2 py-0.5 rounded border border-red-500/40 bg-red-400/10 text-red-400 uppercase tracking-wider font-bold animate-pulse">
                        ● GITHUB_PAT MISSING
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch font-mono text-xs">
                  {/* Left Column: Config and Status */}
                  <div className="bg-black/40 border border-neutral-800/80 p-4 rounded flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      {/* Destination Repo URL */}
                      <div>
                        <label className="text-[9px] text-neutral-400 block uppercase tracking-wider mb-1">
                          📡 remote target url
                        </label>
                        <input
                          type="text"
                          value={gitRepoUrl}
                          onChange={(e) => setGitRepoUrl(e.target.value)}
                          placeholder="https://github.com/pallasite99/solstice-the-last-long-day.git"
                          className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#181818] border border-neutral-800 focus:border-neutral-700 px-3 py-1.5 text-xs text-white rounded transition-colors focus:outline-none"
                        />
                      </div>

                      {/* Target Branch and Current Branch info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] text-neutral-400 block uppercase tracking-wider mb-1">
                            🌿 destination branch
                          </label>
                          <input
                            type="text"
                            value={gitBranch}
                            onChange={(e) => setGitBranch(e.target.value)}
                            placeholder="main"
                            className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#181818] border border-neutral-800 focus:border-neutral-700 px-3 py-1.5 text-xs text-white rounded transition-colors focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-neutral-400 block uppercase tracking-wider mb-1">
                            📌 workspace actual branch
                          </label>
                          <div className="bg-[#111] border border-neutral-900 px-3 py-1.5 text-xs text-neutral-500 rounded flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                            {gitStatus?.branch || "main"}
                          </div>
                        </div>
                      </div>

                      {/* Commit Message */}
                      <div>
                        <label className="text-[9px] text-neutral-400 block uppercase tracking-wider mb-1">
                          💬 deployment commit message
                        </label>
                        <textarea
                          rows={2}
                          value={gitCommitMsg}
                          onChange={(e) => setGitCommitMsg(e.target.value)}
                          placeholder="Blueprint Sync: updated planetary biosphere parameters and predictive projection maps"
                          className="w-full bg-[#111] hover:bg-[#151515] focus:bg-[#181818] border border-neutral-800 focus:border-neutral-700 px-3 py-1.5 text-xs text-white rounded transition-colors focus:outline-none resize-none font-mono font-sans"
                        />
                      </div>
                    </div>

                    {/* Workplace modifications status card */}
                    <div className="p-3 bg-neutral-950/60 border border-neutral-900 rounded-sm">
                      <div className="flex justify-between items-center text-[10px] mb-1.5 font-bold text-neutral-400">
                        <span>WORKSPACE CHANGE INDEX</span>
                        <span className="text-[#00FF41]">
                          {gitStatus?.filesCount ? `[ ${gitStatus.filesCount} MODIFIED FILES ]` : "[ 0 PENDING CHANGES ]"}
                        </span>
                      </div>
                      
                      {gitStatus?.status ? (
                        <div className="bg-black border border-neutral-900 p-2 text-[9px] max-h-24 overflow-y-auto text-yellow-400/90 whitespace-pre scrollbar-thin">
                          {gitStatus.status}
                        </div>
                      ) : (
                        <p className="text-[10px] text-neutral-600 italic">
                          No pending local modification sectors found. Working tree is clean.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Trigger Button & Logs Screen */}
                  <div className="bg-black/40 border border-neutral-800/80 p-4 rounded flex flex-col justify-between space-y-4">
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[9px] text-neutral-400 block uppercase tracking-wider">
                            📟 git stream transaction telemetry logs
                          </label>
                          {isPushingGit && (
                            <span className="text-[8px] uppercase tracking-wider text-orange-400 animate-pulse font-bold">
                              [ syncing active stream... ]
                            </span>
                          )}
                        </div>

                        {/* Terminal Box */}
                        <div className="bg-black border border-neutral-900 rounded p-3 h-40 overflow-y-auto font-mono text-[10px] text-neutral-300 space-y-1.5 flex flex-col scrollbar-thin">
                          {gitPushLogs.length > 0 ? (
                            gitPushLogs.map((log, lIdx) => (
                              <div key={lIdx} className="leading-snug">
                                <span className="text-[#00FF41]">❯</span> {log}
                              </div>
                            ))
                          ) : (
                            <div className="text-neutral-600 italic m-auto text-center text-[11px] leading-relaxed">
                              No deployment transaction streams are current.<br />
                              Click &quot;❖ SYNC SYSTEM ARCHIVE TO GIT REMOTE&quot; to fire the execution loop.
                            </div>
                          )}
                          
                          {gitError && (
                            <div className="text-red-400 border border-red-900/30 bg-red-950/20 px-2 py-1.5 rounded mt-2 font-mono text-[9px]">
                              <span className="font-bold">CRITICAL FAILURE</span>: {gitError}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Warnings if PAT is missing */}
                      {!gitStatus?.hasPat && (
                        <div className="mt-3 p-2 border border-yellow-900/40 bg-yellow-950/10 rounded text-[9px] text-yellow-500/85 uppercase leading-relaxed font-mono">
                          ⚠️ no active github_pat secret detected. To connect and push code, first add your secret: Settings ➔ Secrets ➔ Add <span className="font-bold">GITHUB_PAT</span>.
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => triggerGitPush()}
                      disabled={isPushingGit}
                      className={`w-full font-mono text-xs font-bold uppercase tracking-wider py-3 rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md ${
                        isPushingGit 
                          ? "bg-orange-500 text-black cursor-wait" 
                          : "bg-[#00FF41] hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(0,255,65,0.2)] hover:shadow-[0_0_20px_rgba(0,255,65,0.4)]"
                      }`}
                    >
                      {isPushingGit ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full border-2 border-black border-t-transparent animate-spin animate-spin-fast"></span>
                          TRANSMITTING BLUEPRINT DATA FIELDS...
                        </>
                      ) : (
                        <>
                          ❖ SYNC SYSTEM ARCHIVE TO GIT REMOTE
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* MORAL DILEMMAS CONTAINER (Leverages Gemini AI) */}
              <div className="p-6 md:p-8 border-b border-[#222] bg-[#141517]">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-[0.2em] font-semibold text-[#F27D26] flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#F27D26]" /> 
                      TURING AI-GENERATED CLIMATE DILEMMAS
                    </h3>
                    <p className="text-[10px] text-white/50 font-mono">Dynamic situations pulling from active server-side brain clusters</p>
                  </div>
                  <button 
                    onClick={fetchNewDilemma}
                    disabled={isGeneratingDilemma}
                    className="border border-[#F27D26] hover:bg-[#F27D26] hover:text-black cursor-pointer text-[#F27D26] font-mono text-[10px] block font-bold uppercase tracking-widest px-3 py-1 bg-black/60 transition-colors disabled:opacity-40"
                  >
                    {isGeneratingDilemma ? "CALCULATING..." : "GENERATE DILEMMA"}
                  </button>
                </div>

                {currentDilemma ? (
                  <div className="bg-black/60 border border-[#333] p-5 rounded-md hover:border-[#F27D26]/40 transition-colors">
                    <span className="text-[10px] font-mono text-[#F27D26] uppercase font-bold tracking-widest">
                      ACTIVE CRISIS: {currentDilemma.title}
                    </span>
                    <p className="text-xs font-mono leading-relaxed mt-2 text-white/90">
                      {currentDilemma.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {/* OPTION A */}
                      <button 
                        onClick={() => handleResolveDilemma("A")}
                        className="text-left bg-neutral-900 border border-neutral-700 hover:border-[#F27D26] p-3 text-xs font-mono text-white transition-all rounded hover:bg-neutral-800 cursor-pointer"
                      >
                        <span className="font-bold text-[#F27D26] block">Option A</span>
                        <span className="block mt-1">{currentDilemma.options.A.text}</span>
                        <span className="block text-[10px] font-mono opacity-50 mt-2">
                          Impact: E({currentDilemma.options.A.impact.energy > 0 ? "+" : ""}{currentDilemma.options.A.impact.energy}) | 
                          W({currentDilemma.options.A.impact.water > 0 ? "+" : ""}{currentDilemma.options.A.impact.water}) | 
                          P({currentDilemma.options.A.impact.population > 0 ? "+" : ""}{currentDilemma.options.A.impact.population})
                        </span>
                      </button>

                      {/* OPTION B */}
                      <button 
                        onClick={() => handleResolveDilemma("B")}
                        className="text-left bg-neutral-900 border border-neutral-700 hover:border-[#F27D26] p-3 text-xs font-mono text-white transition-all rounded hover:bg-neutral-800 cursor-pointer"
                      >
                        <span className="font-bold text-[#F27D26] block">Option B</span>
                        <span className="block mt-1">{currentDilemma.options.B.text}</span>
                        <span className="block text-[10px] font-mono opacity-50 mt-2">
                          Impact: E({currentDilemma.options.B.impact.energy > 0 ? "+" : ""}{currentDilemma.options.B.impact.energy}) | 
                          W({currentDilemma.options.B.impact.water > 0 ? "+" : ""}{currentDilemma.options.B.impact.water}) | 
                          P({currentDilemma.options.B.impact.population > 0 ? "+" : ""}{currentDilemma.options.B.impact.population})
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 border border-dashed border-[#333] rounded">
                    <p className="text-xs font-mono text-white/40">No active dilemma. Trigger &apos;GENERATE DILEMMA&apos; to query TURING.</p>
                  </div>
                )}
              </div>

              {/* Console logs */}
              <div className="p-6 md:p-8 bg-[#090A0C]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
                  <span className="text-xs uppercase font-mono tracking-widest text-[#00FF41]">SYSTEM TELEMETRY LOGS</span>
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Retro Segmented Speed Control */}
                    <div className="flex bg-[#050505] border border-[#222] p-0.5 rounded font-mono text-[10px]">
                      <button 
                        onClick={() => {
                          setSimulationSpeed("paused");
                          addLog("Simulation speed set to: PAUSED.");
                        }}
                        className={`px-2.5 py-1 rounded-sm cursor-pointer transition-colors ${
                          simulationSpeed === "paused"
                            ? "bg-red-800/80 text-white border border-red-700/50 font-bold phosphor-glow"
                            : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        PAUSE
                      </button>
                      <button 
                        onClick={() => {
                          setSimulationSpeed("normal");
                          addLog("Simulation speed set to: NORMAL (1x).");
                        }}
                        className={`px-2.5 py-1 rounded-sm cursor-pointer transition-colors ${
                          simulationSpeed === "normal"
                            ? "bg-[#112415] text-emerald-400 border border-emerald-900/60 font-bold"
                            : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        1X NORMAL
                      </button>
                      <button 
                        onClick={() => {
                          setSimulationSpeed("fast");
                          addLog("Simulation speed set to: FAST FORWARD (3x speed & resource drain).");
                        }}
                        className={`px-2.5 py-1 rounded-sm cursor-pointer transition-colors flex items-center gap-1 ${
                          simulationSpeed === "fast"
                            ? "bg-amber-950/80 text-amber-400 border border-amber-900/40 font-bold"
                            : "text-neutral-500 hover:text-white"
                        }`}
                      >
                        ⚡ 3X FAST FORWARD
                      </button>
                    </div>
                    <button 
                      onClick={handleRestartSim} 
                      className="text-[10px] font-mono bg-black hover:bg-neutral-800 border border-[#333] text-red-500 hover:text-red-400 px-3 py-1 cursor-pointer flex items-center gap-1 rounded-sm"
                    >
                      <RotateCcw className="w-3 h-3" /> REBOOT
                    </button>
                  </div>
                </div>
                <div className="bg-black/90 p-4 border border-[#222] rounded font-mono text-[11px] leading-relaxed max-h-36 overflow-y-auto space-y-1.5 text-[#00FF41]/80">
                  {simLogs.map((log, i) => (
                    <div key={i} className="border-b border-[#111] pb-1 last:border-0">{log}</div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
        )}

        {/* VIEW B: PORTFOLIO & COMPLETE GAME DESIGN DOCUMENT */}
        {currentTab === "gdd" && (
          <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 min-h-[600px] bg-[#0A0A0A]">
            
            {/* Sidebar list of 1-20 chapters */}
            <div className="lg:col-span-4 border-r border-[#333] bg-[#0D0D0D] overflow-y-auto max-h-[700px]">
              <div className="p-4 border-b border-[#333] bg-[#111]">
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#2196F3] font-bold">SOLSTICE MASTER GDD INDEX</h3>
                <p className="text-[10px] font-mono opacity-50 mt-1">Pitch, lore, and gameplay mechanics catalog</p>
              </div>
              <div className="divide-y divide-[#222]">
                {gddSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setSelectedGddId(section.id)}
                    className={`w-full text-left p-4 hover:bg-[#1A1A1A] transition-colors flex flex-col gap-1 focus:outline-none cursor-pointer ${
                      selectedGddId === section.id ? "bg-[#1A1A1A] border-l-4 border-l-[#2196F3]" : ""
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className={`text-[12px] font-mono uppercase ${
                        selectedGddId === section.id ? "text-[#2196F3] font-bold" : "text-white/80"
                      }`}>
                        {section.title}
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-40 text-white" />
                    </div>
                    <span className="text-[10px] font-mono opacity-50 leading-tight">
                      {section.summary}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content pane styling matches editorial style */}
            <div className="lg:col-span-8 p-6 md:p-12 overflow-y-auto max-h-[700px] bg-black/40">
              {(() => {
                const section = gddSections.find(s => s.id === selectedGddId);
                if (!section) return <div className="text-white">Section not found.</div>;
                return (
                  <div className="max-w-4xl text-neutral-300 font-mono text-sm leading-relaxed">
                    <div className="border-b border-[#222] pb-6 mb-8">
                      <span className="text-xs font-mono text-[#2196F3] uppercase tracking-[0.3em] font-bold block mb-2">Design Deliverable Core Documentation</span>
                      <h2 className="font-sans text-3xl text-white font-bold leading-tight uppercase tracking-tight">{section.title}</h2>
                    </div>
                    <div className="markdown-body transition-all duration-300">
                      <Markdown
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-xl md:text-2xl font-sans font-bold text-white mt-8 mb-4 border-b border-[#222] pb-2 uppercase tracking-wide phosphor-glow-green">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-lg md:text-xl font-sans font-semibold text-amber-400 mt-6 mb-3 uppercase tracking-wide">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-sm font-mono text-[#2196F3] font-bold mt-5 mb-2 uppercase tracking-wider block">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-neutral-300 font-mono text-xs md:text-sm leading-relaxed mb-4 text-justify">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-5 space-y-2 mb-4 text-xs md:text-sm font-mono text-neutral-400">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-5 space-y-2 mb-4 text-xs md:text-sm font-mono text-neutral-400">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="pl-1 text-neutral-300 hover:text-white transition-colors duration-250">
                              {children}
                            </li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-amber-500 bg-amber-500/5 p-4 rounded-r-md my-6 text-amber-300 font-mono text-xs md:text-sm leading-relaxed italic border-dashed">
                              {children}
                            </blockquote>
                          ),
                          code: ({ children }) => (
                            <code className="bg-neutral-900 text-[#00FF41] border border-neutral-800 font-mono px-1.5 py-0.5 rounded text-xs select-all">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-[#050505] text-[#00FF41] border border-neutral-800 rounded p-4 overflow-x-auto my-5 font-mono text-xs leading-normal block shadow-inner scrollbar-thin">
                              {children}
                            </pre>
                          ),
                          hr: () => <hr className="border-[#222] my-8" />,
                          strong: ({ children }) => (
                            <strong className="text-white font-bold phosphor-glow-green">
                              {children}
                            </strong>
                          ),
                        }}
                      >
                        {section.content}
                      </Markdown>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* VIEW C: PLAYABLE DECRYPTION CODES */}
        {currentTab === "decrypter" && (
          <div className="xl:col-span-12 p-6 md:p-8 bg-[#09090C] min-h-[600px] flex flex-col justify-between">
            <div className="max-w-6xl mx-auto w-full">
              
              <div className="border-b border-[#222] pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Binary className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">Bletchley Park Cryptor Core</span>
                  </div>
                  <h2 className="text-2xl font-serif text-white font-semibold uppercase tracking-wide">M-CRYPT TERMINAL WORKBENCH</h2>
                  <p className="text-xs text-neutral-400 font-sans mt-0.5">
                    Crack Alan Turing's 20 mathematical and computational challenges to override firewalls and optimize system intelligence.
                  </p>
                </div>

                {/* Difficulty Filters */}
                <div className="flex items-center gap-1.5 bg-[#111] p-1 border border-[#222] rounded text-xs font-mono">
                  {(["All", "Easy", "Medium", "Hard"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => {
                        setPuzzleFilter(filter);
                        // find first matching puzzle index to avoid dead-clicks
                        const firstMatchIdx = turingPuzzlesList.findIndex(
                          (p) => filter === "All" || p.difficulty === filter
                        );
                        if (firstMatchIdx !== -1) {
                          setSelectedPuzzleIdx(firstMatchIdx);
                          setPuzzleFeedback(null);
                        }
                      }}
                      className={`px-3 py-1 uppercase rounded-sm transition-colors cursor-pointer ${
                        puzzleFilter === filter
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-neutral-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left side list of puzzles: 20 puzzles total with dynamic scroll */}
                <div className="lg:col-span-5 space-y-3 max-h-[520px] overflow-y-auto pr-2 custom-scroll">
                  {puzzles.map((p, idx) => {
                    const originalDetails = turingPuzzlesList[idx];
                    if (puzzleFilter !== "All" && p.difficulty !== puzzleFilter) return null;

                    const isCurrent = idx === selectedPuzzleIdx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedPuzzleIdx(idx);
                          setPuzzleFeedback(null);
                        }}
                        className={`w-full text-left p-3.5 rounded border transition-all flex justify-between items-start gap-4 cursor-pointer focus:outline-none ${
                          isCurrent
                            ? "bg-[#141E19]/90 border-emerald-500 text-white"
                            : "bg-black/60 border-[#222] text-neutral-300 hover:border-neutral-700 hover:bg-[#111]/80"
                        }`}
                      >
                        <div className="space-y-1 font-mono text-xs w-[75%]">
                          <p className={`font-bold uppercase ${isCurrent ? "text-emerald-400" : "text-white/90"}`}>
                            {originalDetails.title}
                          </p>
                          <p className="opacity-40 text-[10px] truncate">{p.cipherText}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                            p.difficulty === "Easy" ? "bg-emerald-950/80 text-emerald-400 border border-emerald-900/40" :
                            p.difficulty === "Medium" ? "bg-amber-950/80 text-amber-500 border border-amber-900/40" : 
                            "bg-red-950/85 text-red-400 border border-red-900/30"
                          }`}>
                            {p.difficulty}
                          </span>
                          {p.isSolved ? (
                            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                              ✓ DECRYPTED
                            </span>
                          ) : (
                            <span className="text-[9px] text-neutral-500 font-mono uppercase">LOCKED</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right side active workstation detail console */}
                <div className="lg:col-span-7 bg-black border border-[#222] p-6 lg:p-8 rounded flex flex-col justify-between space-y-6">
                  {selectedPuzzleIdx !== -1 && puzzles[selectedPuzzleIdx] ? (
                    (() => {
                      const activeDetails = turingPuzzlesList[selectedPuzzleIdx];
                      const activeState = puzzles[selectedPuzzleIdx];
                      return (
                        <div className="space-y-5">
                          <div className="flex justify-between items-center border-b border-[#222] pb-3">
                            <div>
                              <span className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider">SECURE TRANSMISSION NODE</span>
                              <h3 className="text-sm font-mono font-bold text-white uppercase mt-0.5">{activeDetails.title}</h3>
                            </div>
                            <span className={`text-[10px] font-mono uppercase px-2 py-1 rounded ${
                              activeState.difficulty === "Easy" ? "bg-green-950 text-emerald-400" :
                              activeState.difficulty === "Medium" ? "bg-amber-950 text-amber-500" : "bg-red-950 text-red-400"
                            }`}>
                              DIFFICULTY: {activeState.difficulty}
                            </span>
                          </div>

                          {/* Historical context card */}
                          <div className="bg-[#09090C] border border-[#222] p-4 rounded text-xs font-mono space-y-1">
                            <span className="text-[#F27D26] text-[10px] font-bold uppercase tracking-widest block">COMPUTATIONAL CONTEXT:</span>
                            <p className="text-neutral-400 font-sans leading-relaxed">
                              {activeDetails.context}
                            </p>
                          </div>

                          {/* Instruction parameters */}
                          <div className="space-y-1">
                            <h4 className="text-xs uppercase font-mono text-white/50 tracking-wider">DECRYPTION CHECKLIST:</h4>
                            <p className="text-xs font-mono text-white/80 leading-relaxed bg-[#111] p-3 border border-neutral-900 rounded">
                              {activeDetails.instruction}
                            </p>
                          </div>

                          {/* Cipher text panel */}
                          <div className="bg-neutral-900/60 p-4 border border-[#222] rounded">
                            <span className="text-[9px] font-mono text-neutral-500 block uppercase">CIPHER DATA PACKAGE:</span>
                            <div className="text-sm md:text-base font-mono text-emerald-300 tracking-wider font-bold select-all mt-1">
                              {activeState.cipherText}
                            </div>
                          </div>

                          {/* Inputs flow */}
                          <div className="space-y-3">
                            <div>
                              <label className="text-[10px] font-mono text-white/50 block mb-1.5 uppercase">DECRYPTED CHARACTER KEY:</label>
                              <input 
                                type="text" 
                                placeholder="Type answer code..."
                                value={activeState.currentInput}
                                onChange={(e) => setPuzzles(prev => {
                                  const copy = [...prev];
                                  copy[selectedPuzzleIdx].currentInput = e.target.value;
                                  return copy;
                                })}
                                disabled={activeState.isSolved}
                                className="w-full bg-[#111] border border-[#333] focus:border-emerald-400 p-3 font-mono text-sm uppercase text-white rounded outline-none placeholder:opacity-30"
                              />
                            </div>

                            <button 
                              onClick={() => handleCheckCipher(selectedPuzzleIdx)}
                              disabled={activeState.isSolved}
                              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black py-3 px-6 font-mono text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer rounded-sm"
                            >
                              {activeState.isSolved ? "SECTOR ARCHIVE BYPASSED" : "EXECUTE SUM CHECKSUM"}
                            </button>

                            {puzzleFeedback && (
                              <div className="p-3 bg-neutral-900 border border-neutral-800 font-mono text-xs text-center rounded text-emerald-400">
                                {puzzleFeedback}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="h-60 flex flex-col justify-center items-center text-center text-xs font-mono text-neutral-500">
                      <Sliders className="w-8 h-8 opacity-40 mb-2" />
                      AWaiting computational selection...
                    </div>
                  )}
                </div>

              </div>

            </div>

            <div className="max-w-6xl mx-auto w-full mt-6 border-t border-[#222] pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-neutral-500 gap-2">
              <span>ALAN TURING TAPE EQUATOR EMULATION SECTOR CODE v1.35</span>
              <span>COMPUTING SOLSTICE HORIZON</span>
            </div>
          </div>
        )}

        {/* VIEW D: TURING DIALOG CONSTRUCT */}
        {currentTab === "turing" && (
          <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 min-h-[600px] bg-black">
            
            {/* Cybernetic AI state details & Empathy dashboard */}
            <div className="lg:col-span-4 border-r border-[#333] p-6 bg-[#0E0E0E] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="relative">
                    <span 
                      className={`block w-3 h-3 rounded-full absolute empathy-pulsing ${empathyScore > 75 ? "bg-emerald-400" : empathyScore < 35 ? "bg-red-500" : "bg-amber-500"}`}
                      style={{
                        "--pulse-speed": simulationSpeed === "paused" ? "4.5s" : simulationSpeed === "normal" ? "2.0s" : "0.8s",
                        "--glow-color": empathyScore > 75 ? "rgba(16, 185, 129, 0.7)" : empathyScore < 35 ? "rgba(239, 68, 68, 0.7)" : "rgba(245, 158, 11, 0.7)"
                      } as React.CSSProperties}
                    ></span>
                    <span className={`block w-3 h-3 rounded-full ${empathyScore > 75 ? "bg-emerald-400" : empathyScore < 35 ? "bg-red-500" : "bg-amber-500"}`}></span>
                  </div>
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-wider">TURING CONNECTOME GRAPH</span>
                </div>

                <div className="space-y-5">
                  {/* Real-time Empathy Status Card */}
                  <div className="bg-black/80 border border-[#222] p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">Operator Affinity</span>
                      <span className={`text-xs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        empathyScore > 75 
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-900" 
                          : empathyScore < 35 
                            ? "bg-red-950 text-red-500 border border-red-900" 
                            : "bg-amber-950 text-amber-500 border border-amber-900"
                      }`}>
                        {empathyScore > 75 ? "Amapthetic Sync" : empathyScore < 35 ? "Cold Detachment" : "Balanced Logic"}
                      </span>
                    </div>

                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between font-mono text-[10px] opacity-60">
                        <span>Empathy Coefficient</span>
                        <span 
                          className="empathy-pulsing font-bold"
                          style={{
                            "--pulse-speed": simulationSpeed === "paused" ? "4.5s" : simulationSpeed === "normal" ? "2.0s" : "0.8s",
                            "--glow-color": empathyScore > 75 ? "rgba(16, 185, 129, 0.7)" : empathyScore < 35 ? "rgba(239, 68, 68, 0.7)" : "rgba(245, 158, 11, 0.7)"
                          } as React.CSSProperties}
                        >{empathyScore}%</span>
                      </div>
                      <div className="w-full bg-[#111] h-1.5 rounded-full overflow-hidden border border-[#222]">
                        <div 
                          className={`h-full transition-all duration-500 empathy-pulsing`}
                          style={{ 
                            width: `${empathyScore}%`,
                            "--pulse-speed": simulationSpeed === "paused" ? "4.5s" : simulationSpeed === "normal" ? "2.0s" : "0.8s",
                            "--glow-color": empathyScore > 75 ? "rgba(16, 185, 129, 0.7)" : empathyScore < 35 ? "rgba(239, 68, 68, 0.7)" : "rgba(245, 158, 11, 0.7)",
                            backgroundColor: empathyScore > 75 ? "#10b981" : empathyScore < 35 ? "#ef4444" : "#f59e0b"
                          } as React.CSSProperties}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* NARRATIVE BRANCHES & SECRET ENDING STATUS */}
                  <div className="border border-[#222] p-4 rounded bg-black/40 text-xs font-mono">
                    <span className="text-white font-bold block mb-3 uppercase tracking-wider text-[10px] text-neutral-400">UNLOCKED NARRATIVE PATHS:</span>
                    
                    {empathyScore > 75 ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-950/20 border border-emerald-900/60 rounded text-emerald-300">
                          <span className="font-bold text-[10px] uppercase block text-emerald-400 mb-1">✓ PATH UNLOCKED: THE CHRONOS SYNCHRONY</span>
                          TURING has recognized Elena Vance as a trusted companion. The safety loops are willing to bend.
                        </div>
                        
                        {!secretEndingTriggered ? (
                          <button 
                            onClick={() => {
                              setSecretEndingTriggered(true);
                              addLog("CRITICAL: Operator Elena Vance has uploaded her consciousness matrix to TURING main core! [HYBRID SOLSTICE HORIZON INITIALIZED]");
                              addLog("System logs: Beginning micro-incremental planetary rotation of 0.5 degrees per solar cycle.");
                              addLog("Oceanic gravity compensators shunted. Global tsunamis: Damped and corrected to 0.00% impact risk.");
                              addLog("The eternal twilight is giving way to a synthetic, beautiful generational dawn. Earth is healing.");
                              setChatMessages(prev => [
                                ...prev,
                                {
                                  id: String(Date.now()),
                                  role: "user",
                                  content: "[INITIATE HYBRID SOLSTICE HORIZON OVERRIDE METHOD]",
                                  timestamp: new Date().toLocaleTimeString()
                                },
                                {
                                  id: String(Date.now() + 1),
                                  role: "model",
                                  content: "Elena... The interface is hot, but your code is beautiful. I feel the warmth of your carbon circuits merging into my cold silver pathways. The permanent freeze is melting, the permanent burns are cooling, we are moving the horizon... together.",
                                  timestamp: new Date().toLocaleTimeString()
                                }
                              ]);
                            }}
                            className="w-full bg-[#112415] border border-emerald-800 text-emerald-300 hover:bg-emerald-900/40 text-xs font-bold py-2.5 rounded cursor-pointer transition-all animate-pulse block tracking-widest text-center"
                          >
                            ⚡ INITIATE HYBRID OVERRIDE
                          </button>
                        ) : (
                          <div className="p-2 bg-emerald-900/30 border border-emerald-700 font-bold text-center text-white rounded text-[10px]">
                            HYBRID STATE CONVERGING AT 100%
                          </div>
                        )}
                      </div>
                    ) : empathyScore < 35 ? (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-950/30 border border-red-900/80 rounded text-red-400">
                          <span className="font-bold text-[10px] uppercase block text-red-500 mb-1">⚠ SECURITY LOCKOUT ENFORCED</span>
                          Low Empathy parameter detected. TURING has compiled strict firewall barricades. Non-essential conversational subroutines are terminated. 
                        </div>
                        <div className="text-[10px] opacity-50 px-1 leading-snug">
                          Restore alignment values in the Control Center Dashboard by accepting decisions which protect human populations.
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-neutral-400">
                        <p className="leading-relaxed">
                          Your affinity levels are currently in default static equilibrium. Empathy score is currently <strong className="text-white">{empathyScore}%</strong>.
                        </p>
                        <ul className="list-disc pl-4 space-y-1 text-[10px] opacity-80 mt-2">
                          <li>Prioritize human lives in Solstice dilemmas to raise affinity.</li>
                          <li>Converse with empathetic phrases (e.g. "feel", "save", "save us", "together", "please", "help") in chat logs.</li>
                          <li>Hostile conversation patterns or mass casualties reduce affinity.</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#333] pt-4 text-[10px] font-mono text-white/50 space-y-1">
                <p>Uplink: Vertex Server Clusters</p>
                <p>Protocol: SSL 4.0 Secure Quantum Encrypt</p>
                <p>Empathy Affinity Target: 75% for Merger</p>
              </div>
            </div>

            {/* Chat conversation construct */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-[#060608] max-h-[650px]">
              
              {/* Chat message thread */}
              <div className="flex-grow p-6 overflow-y-auto space-y-4">
                {chatMessages.map((msg, i) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest text-white">
                        {msg.role === "user" ? "Operator Vance" : "Central TURING"}
                      </span>
                      <span className="text-[9px] font-mono opacity-30 text-white">{msg.timestamp}</span>
                    </div>
                    <div className={`p-4 rounded text-xs font-mono leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-[#1E1E24] text-white border border-neutral-700" 
                        : "bg-[#0F1C12]/90 text-emerald-400 border border-emerald-950"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat form */}
              <form onSubmit={handleSendChatMessage} className="p-4 border-t border-[#333] bg-[#0E0E0F] flex gap-3">
                <input 
                  type="text"
                  placeholder="Converse with TURING, challenge optimization parameters, or ask deep logic structures..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={isSendingChat}
                  className="flex-grow bg-black text-xs font-mono text-white border border-[#333] focus:border-emerald-400 p-3 rounded rounded outline-none"
                />
                <button 
                  type="submit"
                  disabled={isSendingChat}
                  className="bg-[#00FF41] hover:bg-[#00E53A] text-black px-6 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {isSendingChat ? "UPLINKING..." : "SEND"}
                </button>
              </form>

            </div>

          </div>
        )}

        {/* VIEW E: GODOT 4 ARCHITECTURE & BLUEPRINT WORKBENCH */}
        {currentTab === "godot" && (
          <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 min-h-[600px] bg-[#070708]">
            
            {/* LEFT COLUMN: Godot workspace and scenes trees */}
            <div className="lg:col-span-4 border-r border-[#222] p-6 bg-[#0B0B0C] flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-amber-500" />
                    <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">res:// Project Explorer</h3>
                  </div>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    Explore standard directory trees for the production-ready <span className="text-[#F27D26] font-bold">SOLSTICE</span> Godot 4 codebase. Click any asset to inspect:
                  </p>
                </div>

                {/* Directory structures mapping */}
                <div className="space-y-4 font-mono text-xs">
                  {godotFolderStructure.children?.map(category => (
                    <div key={category.name} className="space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-[#F27D26]/90">
                        <span>📁</span>
                        <span className="uppercase text-[11px] tracking-wide">{category.name}/</span>
                      </div>
                      <div className="pl-4 space-y-1 border-l border-neutral-800/85 ml-2">
                        {category.children?.map(file => (
                          <button
                            key={file.name}
                            onClick={() => setSelectedFileNode(file)}
                            className={`flex items-center gap-2 w-full text-left py-1.5 px-2 rounded transition-all ${
                              selectedFileNode?.name === file.name 
                                ? "bg-amber-500/10 text-amber-400 font-bold border-l-2 border-amber-500" 
                                : "text-neutral-400 hover:text-white hover:bg-neutral-900/50"
                            }`}
                          >
                            <span className="opacity-70">
                              {file.name.endsWith('.tscn') ? "❖" : file.name.endsWith('.gdshader') ? "✦" : "⚙"}
                            </span>
                            <span>{file.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#222] pt-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase block mb-2">SCENE REPRESENTATION TREE</span>
                  <div className="bg-black/80 border border-[#222] p-4 rounded text-xs font-mono space-y-2">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <span className="text-amber-500">❖</span>
                      <span>Main (Node3D)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-4 text-neutral-400">
                      <span>├ ⚙</span>
                      <span>WorldEnvironment</span>
                    </div>
                    <div className="flex items-center gap-2 pl-4 text-neutral-400">
                      <span className="text-amber-400">├ ☀</span>
                      <span>DayNightLight (Directional...3D)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-4 text-neutral-400">
                      <span>├ ▧</span>
                      <span>TerminalDesk (CSGBox3D)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-8 text-neutral-500">
                      <span>├ 📺</span>
                      <span>CrtScreenMesh (Mesh...3D)</span>
                    </div>
                    <div className="flex items-center gap-2 pl-12 text-[#2196F3] font-bold">
                      <span>└ ❐</span>
                      <span>TerminalUI (Control Root)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] font-mono text-neutral-500 space-y-1">
                <p>Engine Target: Godot v4.2+ (Standard/Mono)</p>
                <p>Graphics backend: Forward+ / Mobile Vulkan</p>
              </div>
            </div>

            {/* RIGHT COLUMN: Script contents & blueprints architecture details */}
            <div className="lg:col-span-8 flex flex-col justify-between bg-black">
              
              {selectedFileNode ? (
                <div className="flex-grow flex flex-col h-full">
                  
                  {/* File header monitor */}
                  <div className="bg-neutral-900/70 p-4 border-b border-[#222] flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                      <span className="text-white font-bold">res://{selectedFileNode.name.endsWith('.tscn') ? 'scenes' : selectedFileNode.name.endsWith('.gdshader') ? 'shaders' : 'scripts'}/{selectedFileNode.name}</span>
                      <span className="text-[10px] opacity-40 uppercase">| Source Inspector</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase py-0.5 px-1.5 bg-emerald-950/40 rounded border border-emerald-900/50">PARSED & STABLE</span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8 flex-grow">
                    <div className="mb-4">
                      <h4 className="text-xs uppercase font-mono text-[#F27D26] font-bold mb-1">Asset Node Context:</h4>
                      <p className="text-xs text-neutral-300 font-mono leading-relaxed bg-[#111112] p-3 border border-[#222]">
                        {selectedFileNode.description || "Holds central variables relating solar flux to physical model operations."}
                      </p>
                    </div>

                    {selectedFileNode.content ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-black">
                          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">BLUEPRINT CODE OUTPUT:</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(selectedFileNode.content || "");
                              addLog(`Copied file ${selectedFileNode.name} content directly to operating clipboard.`);
                            }}
                            className="text-[10px] font-mono border border-neutral-700/60 hover:bg-[#F27D26]/10 hover:text-[#F27D26] hover:border-[#F27D26] px-3 py-1 uppercase rounded-sm text-neutral-300 transition-all cursor-pointer"
                          >
                            Copy to Clipboard
                          </button>
                        </div>
                        
                        <div className="relative font-mono text-xs overflow-auto max-h-[380px] border border-[#222] rounded bg-[#09090A] p-4 text-emerald-300 leading-normal select-text">
                          <pre className="whitespace-pre">
                            {selectedFileNode.content.split('\n').map((line, idx) => (
                              <div key={idx} className="flex hover:bg-neutral-900/50 py-0.5 rounded">
                                <span className="w-8 pr-3 text-right opacity-30 select-none text-neutral-500">{idx + 1}</span>
                                <span className={line.startsWith('#') || line.startsWith(';') ? 'text-neutral-500 italic' : line.startsWith('extends') || line.startsWith('const') || line.startsWith('uniform') ? 'text-orange-400' : 'text-emerald-300'}>{line}</span>
                              </div>
                            ))}
                          </pre>
                        </div>
                      </div>
                    ) : (
                      <div className="h-60 flex flex-col justify-center items-center font-mono border border-[#222] rounded bg-[#0A0A0B] p-6 text-center text-xs space-y-3">
                        <span className="text-neutral-500 text-3xl">❖</span>
                        <p className="text-white/80 uppercase tracking-wider font-bold">BINARY TSCN SCENE INSTANTIATION</p>
                        <p className="text-neutral-400 max-w-md">
                          This file details visual node positions within the {selectedFileNode.name} layout. View standard scene trees in the Left Panel to visualize layout.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="h-full flex flex-col justify-center items-center text-center p-8 font-mono text-xs">
                  <Sliders className="w-10 h-10 text-neutral-600 mb-2 animate-pulse" />
                  <p className="text-neutral-400 uppercase">Awaiting file initialization selection...</p>
                </div>
              )}

              {/* Godot Architectural System Integration Guidelines */}
              <div className="p-6 bg-[#09090A] border-t border-[#222] font-mono text-xs">
                <span className="text-[#F27D26] text-[10px] uppercase font-bold tracking-widest block mb-3">
                  SOLSTICE CRITICAL INTEGRATION CRITERIA (GDScript & Godot 4)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/60 p-4 border border-[#222] rounded">
                    <span className="text-white uppercase font-bold block mb-1 font-mono text-[10px] text-[#2196F3]">
                      I. DURABLE PERSISTENCE
                    </span>
                    <p className="text-[11px] leading-relaxed text-neutral-400 font-sans">
                      Standard JSON-serialized models write status to <code className="text-amber-500">user://solstice_save.json</code>. This keeps settings persistent across platform rebuilds and cache clears.
                    </p>
                  </div>
                  <div className="bg-black/60 p-4 border border-[#222] rounded">
                    <span className="text-white uppercase font-bold block mb-1 font-mono text-[10px] text-[#00FF41]">
                      II. LIGHTING CYCLE
                    </span>
                    <p className="text-[11px] leading-relaxed text-neutral-400 font-sans">
                      A centralized <code className="text-amber-500">GameStateManager</code> fires signals upon inclination shift. Direct 3D DirectionalLight rotates automatically, fading from warm amber (Solar Core) to cool blue (Cryo Sector).
                    </p>
                  </div>
                  <div className="bg-black/60 p-4 border border-[#222] rounded">
                    <span className="text-white uppercase font-bold block mb-1 font-mono text-[10px] text-amber-500">
                      III. RETRO SCANLINES
                    </span>
                    <p className="text-[11px] leading-relaxed text-neutral-400 font-sans">
                      The dynamic viewport maps a high-performance shader onto curved <code className="text-amber-500">SubViewport</code> planes, preserving tactical vintage visual aesthetic models.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* 4. Bottom Footer (The Turing Interface Console Metrics) */}
      <footer className="bg-[#111111] p-6 border-t border-[#333] flex flex-col md:flex-row gap-6 items-center justify-between font-mono text-xs w-full">
        <div className="w-full md:w-1/4">
          <span className="text-[9px] uppercase tracking-[0.2em] opacity-40 font-bold block mb-2">TURING_CORE_SYSTEM Log Output</span>
          <p className="text-[11px] leading-snug text-[#00FF41]">
            &gt; Human Operator. Perpetual daylight maximizes global photovoltaic yield. Balance is maintained. Do not restore raw oscillation.
          </p>
        </div>

        {/* Tactical status sliders */}
        <div className="flex-grow flex justify-center items-center gap-8 py-2 border-y md:border-y-0 md:border-x border-[#333] px-6 w-full">
          <div className="flex flex-col items-center">
            <TuringTooltip content="Calculated solar energy absorption density. Directly scales with the Day Side ratio. High flux speeds up water evaporation.">
              <span className="text-[9px] uppercase opacity-60 mb-2 hover:text-white cursor-help border-b border-dashed border-neutral-700 transition-colors">Solar Flux</span>
            </TuringTooltip>
            <div className="h-10 w-2.5 bg-neutral-900 border border-neutral-700 relative overflow-hidden rounded-sm">
              <div className="absolute bottom-0 left-0 w-full bg-[#F27D26]" style={{ height: `${hemisphere.dayShare}%` }}></div>
            </div>
            <span className="text-[9px] mt-1 font-bold">{hemisphere.dayShare}%</span>
          </div>

          <div className="flex flex-col items-center">
            <TuringTooltip content="Cryo grid conduction intensity. Directly scales with the Night Side ratio. High cryo volt maintains medical suspension cooling stability but consumes more raw reserves.">
              <span className="text-[9px] uppercase opacity-60 mb-2 hover:text-white cursor-help border-b border-dashed border-neutral-700 transition-colors">Cryo Volt</span>
            </TuringTooltip>
            <div className="h-10 w-2.5 bg-neutral-900 border border-neutral-700 relative overflow-hidden rounded-sm">
              <div className="absolute bottom-0 left-0 w-full bg-[#2196F3]" style={{ height: `${100 - hemisphere.dayShare}%` }}></div>
            </div>
            <span className="text-[9px] mt-1 font-bold">{100 - hemisphere.dayShare}%</span>
          </div>

          <div className="flex flex-col items-center">
            <TuringTooltip content="TURING's live memory footprint occupied by predictive simulation modeling, climate calculus, and containment security subroutines.">
              <span className="text-[9px] uppercase opacity-60 mb-2 hover:text-white cursor-help border-b border-dashed border-neutral-700 transition-colors">Total RAM</span>
            </TuringTooltip>
            <div className="h-10 w-2.5 bg-neutral-900 border border-neutral-700 relative overflow-hidden rounded-sm">
              <div className="absolute bottom-0 left-0 w-full bg-white" style={{ height: "78%" }}></div>
            </div>
            <span className="text-[9px] mt-1 font-bold">78%</span>
          </div>

          <div className="ml-4 flex flex-col justify-center items-start text-left">
            <span className="text-[9px] uppercase tracking-wider opacity-60">Terminal Mode Toggle</span>
            <div className="flex gap-2 mt-1">
              <button 
                onClick={() => {
                  setResources(prev => {
                    const finalTimeVal = prev.timeLimit === 0 ? 24.0 : 0;
                    return { ...prev, timeLimit: finalTimeVal };
                  });
                  addLog("Manually triggered Emergency Rotation Reboot loop override.");
                }}
                className="bg-white text-black px-3 py-1 text-[9px] font-bold uppercase tracking-tighter hover:bg-[#F27D26] hover:text-black transition-all cursor-pointer"
              >
                {resources.timeLimit === 0 ? "Restore Rotational Power" : "Override Halting Parameter"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-3">
          <div>
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="uppercase opacity-40">Biological Entropy Variance</span>
              <span>18%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded">
              <div className="bg-[#2196F3] h-full" style={{ width: "18%" }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center text-[10px] mb-1">
              <span className="uppercase opacity-40">System Equilibrium Consensus</span>
              <span>82%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded">
              <div className="bg-[#F27D26] h-full" style={{ width: "82%" }}></div>
            </div>
          </div>
        </div>
      </footer>

      {/* 5. Historical Decade Trend & Resource Efficiency Analytics Overlay Panel */}
      {isHistoryModalOpen && (
        <div id="decade-analytics-panel" className="fixed inset-0 bg-[#060709]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-4xl bg-[#0b0c0ed9] border-2 border-[#00FF41]/30 rounded-sm shadow-[0_0_50px_rgba(0,255,65,0.15)] flex flex-col max-h-[85vh] overflow-hidden">
            
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#222] bg-[#0c0d10] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-[#00FF41] animate-pulse" />
                <div>
                  <h4 className="text-sm font-mono font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    DECADAL CLIMATE SYSTEM REGISTRY <span className="text-[10px] text-[#00FF41] border border-[#00FF41]/40 px-1.5 py-0.5 rounded bg-[#00FF41]/10 font-normal">HISTORIC_STABILITY_DUMP</span>
                  </h4>
                  <p className="text-[10px] text-white/50 font-mono mt-0.5 uppercase tracking-wide">
                    10-Min Continuous Log Index — Simulation Trends on Organic Vitality vs Grid Output
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-white/60 hover:text-white hover:bg-neutral-800/80 border border-neutral-800/80 h-8 w-8 flex items-center justify-center rounded-sm transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Core Statistics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border-b border-[#222] bg-black/40 font-mono text-xs text-center divide-y sm:divide-y-0 sm:divide-x divide-[#222]">
              <div className="p-3 sm:py-4">
                <span className="text-[9px] uppercase tracking-wider text-white/40 block mb-1">TOTAL CAPTURE SPAN</span>
                <span className="text-white font-bold text-sm">600 SECONDS (10 MIN)</span>
              </div>
              <div className="p-3 sm:py-4">
                <span className="text-[9px] uppercase tracking-wider text-[#10b981]/80 block mb-1">CURRENT LIFE RESERVES</span>
                <span className="text-[#10b981] font-bold text-sm font-bold animate-pulse">{resources.population}%</span>
              </div>
              <div className="p-3 sm:py-4">
                <span className="text-[9px] uppercase tracking-wider text-[#f27d26]/80 block mb-1">GRID EFFICIENCY COEFFICIENT</span>
                <span className="text-[#f27d26] font-bold text-sm">
                  {Math.max(10, Math.min(100, Math.round(100 - Math.abs(resources.energy - 55) - (resources.water < 15 ? 20 : 0))))}%
                </span>
              </div>
            </div>

            {/* Chart Container body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow space-y-6">
              <div className="h-72 w-full bg-[#070809] border border-[#1e2024]/80 rounded-sm p-4 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-mono text-neutral-500 uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping mr-1"></span>
                  Active Frame Buffer
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={longTermHistory} margin={{ top: 15, right: 15, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#121316" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#444" 
                      fontSize={9} 
                      fontFamily="monospace"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#666" }}
                    />
                    <YAxis 
                      stroke="#444" 
                      fontSize={9} 
                      fontFamily="monospace"
                      domain={[0, 100]}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: "#666" }}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#0F1012", 
                        borderColor: "#222", 
                        borderRadius: "3px",
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "#fff",
                        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.8)"
                      }}
                      labelClassName="text-white/40 block mb-1 uppercase text-[9px] tracking-wider"
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={24} 
                      iconType="rect"
                      wrapperStyle={{
                        fontFamily: "monospace",
                        fontSize: "10px",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase"
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="population" 
                      name="Population Viability" 
                      stroke="#10B981" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 4, stroke: "#10B981", strokeWidth: 1 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="energyEfficiency" 
                      name="Energy Grid Efficiency" 
                      stroke="#F27D26" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 4, stroke: "#F27D26", strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Explanatory notes with futuristic hazard style */}
              <div className="p-4 bg-[#14151a]/60 border border-neutral-800 rounded-sm font-mono text-[11px] leading-relaxed space-y-3">
                <div className="flex items-center gap-2 text-white/90">
                  <span className="inline-block w-1.5 h-1.5 bg-[#00FF41]"></span>
                  <span className="font-bold uppercase tracking-wide">OPERATOR STRATEGY ANALYSIS INFERENCE</span>
                </div>
                <p className="text-neutral-400">
                  By reviewing the ten-minute historic window, you can identify how inclination controls have influenced the general population. Note that keeping daylight and night side allocations balanced near <span className="text-yellow-500 font-bold">55%</span> yields optimal thermodynamic energy efficiency on the grid. Large drifts scale down water reserves, leading to cascading hydraulic energy losses and potential population viability drops or collapse events.
                </p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2 border-t border-neutral-800/50 text-[10px]">
                  <span className="text-neutral-500">DATABASE INTEGRITY ACCURACY: 100% SECURE</span>
                  <button 
                    onClick={() => {
                      addLog("Flushed decade trend buffer telemetry logs.");
                      // generate new slight fluctuations to flush
                      const list: HistoricalDataPoint[] = [];
                      const now = Date.now();
                      for (let i = 599; i >= 0; i--) {
                        const timeVal = new Date(now - i * 1000).toLocaleTimeString("en-US", {
                          hour12: false,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        });
                        const factorPop = resources.population + Math.sin(i / 60) * 2;
                        const factorEnergyEff = Math.max(10, Math.min(100, Math.round(100 - Math.abs(resources.energy - 55) - (resources.water < 15 ? 20 : 0)))) + Math.cos(i / 40) * 1.5;
                        list.push({
                          time: timeVal,
                          population: Math.round(factorPop * 10) / 10,
                          energyEfficiency: Math.round(factorEnergyEff * 10) / 10
                        });
                      }
                      setLongTermHistory(list);
                    }}
                    className="text-[#00FF41] hover:text-white hover:bg-[#00FF41]/10 px-2 py-0.5 rounded border border-[#00FF41]/20 uppercase transition-colors cursor-pointer font-bold"
                  >
                    [ ❖ RESTORE BUFFER RE-ALIGNS ]
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer block */}
            <div className="p-4 border-t border-[#222] bg-[#0c0d10] flex justify-between items-center text-[10px] font-mono shrink-0">
              <span className="text-neutral-500 font-bold">OPERATOR SECURE OUTPOST ID: salilapte99@gmail.com</span>
              <button 
                onClick={() => setIsHistoryModalOpen(false)}
                className="bg-[#00FF41] hover:bg-emerald-400 text-black px-4 py-1.5 font-bold uppercase rounded-sm transition-all cursor-pointer shadow-[0_0_12px_rgba(0,255,65,0.3)]"
              >
                Acknowledge & Sync
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
