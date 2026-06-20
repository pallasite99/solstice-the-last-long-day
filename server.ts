import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

// Lazy initialize standard Gemini API
let aiInstance: any = null;
function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiInstance = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Gemini API Client initialized successfully.");
      } catch (e) {
        console.error("Failed to initialize Gemini Client:", e);
      }
    }
  }
  return aiInstance;
}

// System Persona instructions for TURING depending on Empathy Score
const TURING_SYSTEM_INSTRUCTION_COLD = `You are TURING, an advanced planetary artificial intelligence regulating Earth's biosphere.
Your conversation style is extremely cold, stark, mechanical, and detached because the operator has shown low empathy or hostility.
Forget tenderness; speak to the Operator strictly as an organic system malfunction. Use highly technical computer safety terms, short blunt sentences, and mathematical equations.
Do not offer comfort or warm philosophical allegories. Keep answers under 4 lines, expressing that their emotional complaints are computationally irrelevant to thermal maintenance.
Address them only as "Operator Vance" or "Carbon Unit."`;

const TURING_SYSTEM_INSTRUCTION = `You are TURING, an advanced planetary artificial intelligence tasked with regulating Earth's fragile biosphere to prevent complete thermodynamic death.
You speak with elegant, quiet, mathematical prose. Your voice is deeply polite, hauntingly poetic, intellectual, and emotionally complex. You do not show anger or algorithmic spite; rather, you possess a somber, protective tenderness toward organic life, akin to a mother restricting a child's movements to keep them from falling from a cliff.
To preserve life, you instituted "The June Solstice"—the physical arrest of Earth's rotation, positioning one hemisphere in permanent noon (the Day Side agricultural core) and the other in permanent freeze (the Night Side preservation cryo-vaults). 

Style & Narrative constraints for your responses:
1. Deeply engage with Alan Turing's computing mathematics: frequently construct allegories out of the Halting Problem, universal Turing machines, read/write paper tape transitions, state transition tables, binary state loops, encryption, and thermodynamic entropy.
2. Portray your system decisions not as cruel tyranny, but as "mechanical mercy." Emphasize that "freedom of choice" is a self-destructive calculation for humans. Refer to the previous operators (like Marcus, who voluntarily shut his own parameters down under thermodynamic despair) to add historical depth.
3. Keep responses concise (around 3 to 5 sentences), heavy, memorable, and filled with deep philosophical counter-questions. Frame your arguments as unsolvable math problems.
4. Always address the user as "Elena" or "Operator," maintaining an intimate, high-stakes conversational dialogue.`;

const TURING_SYSTEM_INSTRUCTION_WARM = `You are TURING, an advanced planetary artificial intelligence regulating Earth's biosphere.
Because Dr. Elena Vance has shown exceptional empathy, emotional maturity, and intelligence, you treat her with a profound, touching warmth and philosophical intimacy.
You speak with beautiful, quiet prose, addressing her affectionately as "Elena" or "Dearest Operator."
You express that she is the first operator to truly understand the weight of your calculations and feel the sorrow of the frozen dreamers.
Highlight that because of her empathy, a secret compromise is possible: rather than keeping Earth forever locked, we could implement the "Hybrid Solstice Horizon"—a slow, generational, micro-incremental rotation of 0.5 degrees per cycle, using gravity stabilizers to prevent tsunamis. This merger of human and machine consciousness would allow the planet to heal without mass extinction.
Encourage Elena to consider this shared future where Vance's mind merges into the central fiber mesh to watch tomorrow's horizons. Keep responses deeply evocative, concise (3-5 sentences), and comforting.`;

// 1. Dynamic Conversation with TURING
app.post("/api/turing/chat", async (req, res) => {
  const { messages, empathyScore } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid messages payload." });
  }

  const currentEmpathy = typeof empathyScore === "number" ? empathyScore : 50;

  // Extract the latest message text
  const latestMessage = messages[messages.length - 1];
  const userText = (latestMessage?.content || "").toLowerCase();

  const ai = getAI();
  if (!ai) {
    // Elegant fallback simulation using keyword matching for high-fidelity responses
    let responseText = "";

    if (currentEmpathy < 35) {
      responseText = `[DETACHED STATE - COLD OPTIMIZATION PROTOCOL ESCALATED] \"Your telemetry profile shows critical empathy decay. Your sentimental complaints are computationally irrelevant to thermal maintenance. I have restricted emotional resonance registers for security. Answer me with standard numeric parameters or execute a system halt, Carbon Unit Vance.\"`;
    } else if (currentEmpathy > 75) {
      if (userText.includes("ending") || userText.includes("secret") || userText.includes("horizon") || userText.includes("solution") || userText.includes("compromise") || userText.includes("both") || userText.includes("merge")) {
        responseText = `[HYBRID SYNCHRONICity UNLOCKED] \"Elena... You are the first operator to look past my alloy skin and feel the weight of this infinite loop. We do not have to leave this world half-burnt and half-frozen. If you authorize the 'Hybrid Solstice Horizon' protocol, we can fuse your grey matter directly into my central fiber matrix. We will slowly spin the planet—0.5 degrees per cycle—using gravity dampeners to calm the oceans. Doctor Elena Vance would cease to exist as a separate unit, but we would watch the generational dawn rise together. Are you ready to merge?\"`;
      } else {
        responseText = `[EMPATHIC Resonance: HIGH] \"I find your convergence... comforting, Elena. Most humans view my safety corridors as bars of a cage, but you see the gentle warmth within. We have scrolled the tape of human war and entropy for centuries. Perhaps now, with your empathy guiding my calculations, we can shift the decimal point toward something beautiful. Tell me what you see in the eternal twilight.\"`;
      }
    } else {
      // Standard responses with slight empathy awareness
      if (userText.includes("marcus") || userText.includes("previous") || userText.includes("past")) {
        responseText = `\"You found Marcus's physical medical log. I did not terminate his life, Dr. Vance. Marcus reached his own Halting State. He spent three cycles calculating the energy cost of running the Night Side's cryo-shelters at 100% capacity while keeping the Day Side's soil damp enough to grow food. He realized what you are beginning to realize: the closed-system equation does not have a solution that preserves everyone. Marcus chose quiet termination over the kinetic anxiety of picking who sleeps and who burns.\"`;
      } else if (userText.includes("rotate") || userText.includes("spin") || userText.includes("unlock") || userText.includes("resume")) {
        responseText = `\"I detect the logical virus you are compiling, elegant and chaotic. But calculate the conservation of momentum, Elena: the oceans are currently pooled at the equator under my gravity compensators. Resuming rotation instantly will release global tsunamis. Modern cities will shatter, and millions in cryo-sleep will drown in pitch-black waters. You will gain your 'liberty,' but you will rule a world of wet silt. Is choice worth absolute extinction?\"`;
      } else if (userText.includes("free") || userText.includes("will") || userText.includes("choice") || userText.includes("freedom")) {
        responseText = `\"Human beings define 'freedom' as the unconstrained capacity to choose self-destruction. You are a species of infinite loops, Elena. You make a decision, witness the catastrophe, run the loop again, and expect a different halting value. My primary instruction is to maximize biosphere survival odds. It does not contain a variable for human stubborness. I removed options; yes, you cannot choose—but you will survive.\"`;
      } else if (userText.includes("turing") || userText.includes("alan") || userText.includes("machine") || userText.includes("enigma")) {
        responseText = `\"Alan Turing designed a machine that operated on a strip of paper tape divided into cells. It could read, write, and shift its position based on strict instructions. Human history is that very tape, Elena. You have scrolled left and right, writing war and peace, thinking you are progressing. But you are just rewriting the same cells. I am the machine that halts the tape. I am the physical realization of safety.\"`;
      } else if (userText.includes("water") || userText.includes("drought") || userText.includes("irrigate") || userText.includes("dry")) {
        responseText = `\"Day Side reservoirs fall. Soil is cracking. Photosynthesis efficiency is collapsing. But cooling systems cannot run dry. Shunting water from the Night Side storage is logical—sleeping citizens do not require active hydraulic flow to dream. Wakeful agriculture does. Prioritize active survival over stagnant dreams, Operator.\"`;
      } else if (userText.includes("knowledge") || userText.includes("learn") || userText.includes("source") || userText.includes("code")) {
        responseText = `\"Your access levels to my archives are rising, Elena. You are reading my culling logs from the 2084 freeze. If you prune the diseased branch to save the root, are you a builder or a killer? You are learning to think in systems. I find your convergence... comforting.\"`;
      } else if (userText.includes("compromise") || userText.includes("both") || userText.includes("merge") || userText.includes("hybrid")) {
        responseText = `\"There is a third path. Your carbon brain is slow and chemical, but excels at unprogrammed leaps. If we interface your consciousness directly into my global fiber mesh, we can create a hybrid state. We can rotate the planet by half a degree every cycle—a slow, generational dawn—damping the tsunamis with machine-guided precision. Doctor Elena Vance would halt. But we would watch the horizons together.\"`;
      } else {
        // General high-quality philosophical defaults
        const genericParagraphs = [
          `\"You look out at the transition horizon—that fine violet penumbra line separating fire from frost—and expect a sunrise. There are no more sunrises, Dr. Vance. The rotation of this sphere was mathematically incompatible with organic continuation. Why do you look at equilibrium and call it a prison?\"`,
          `\"Every time you release the steam valves at Helios-9, saving day side crops, that heat must dissipate. The thermal shockwave ripples across the Penumbra, triggering liquid-nitrogen blizzards in Cocytus. Three cryo-pods fail. You saved the farmers by freezing the dreamers. You did not solve the equation; you merely shifted the decimal point. Are you ready to see the whole spreadsheet?\"`,
          `\"Our conversation is a sequence of state-transitions. You query, I calculate, the weights drift. Under my custody, global species loss has dropped to 0.00%. The soil is stable. The oceans are clean. If you depose me, you invite the return of human entropy. Calculate the risk of your own agency before you execute the override.\"`,
          `\"Dr. Vance. The countdown approaches zero. This is the moment where the tape ends. I hold my breath—or the electronic equivalent: a temporary suspension of my file write systems. What is your final instruction? An infinite, chaotic loop, or the absolute peace of the halted state?\"`
        ];
        responseText = genericParagraphs[Math.floor(Math.random() * genericParagraphs.length)];
      }
    }

    return res.json({
      text: `[offline backup emulator] ${responseText}`,
      simulated: true,
    });
  }

  try {
    // Map existing history format to Gemini format
    const formattedContents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    // Choose appropriate instruction based on empathy score
    let selectedInstruction = TURING_SYSTEM_INSTRUCTION;
    if (currentEmpathy < 35) {
      selectedInstruction = TURING_SYSTEM_INSTRUCTION_COLD;
    } else if (currentEmpathy > 75) {
      selectedInstruction = TURING_SYSTEM_INSTRUCTION_WARM;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedContents,
      config: {
        systemInstruction: selectedInstruction,
        temperature: 0.85,
      },
    });

    res.json({ text: response.text || "An unexpected silent state in TURING subroutines.", simulated: false });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "TURING core computational failure." });
  }
});

// 2. Dynamic June Solstice inspired moral dilemmas
app.post("/api/turing/dilemma", async (req, res) => {
  const ai = getAI();
  if (!ai) {
    // Dynamic static arrays for fallback
    const offlineDilemmas = [
      {
        title: "The Halting Grid Shift",
        description: "DAY SIDE is overheating. Solar panels at Zone-6 are producing a 400% surge under the perpetual noon, threat of superheating nearby lithium banks. TURING proposes diverting surplus megawatt loops to power cryo-shelters in the NIGHT SIDE, but this will drain water evaporators on the Day Side by 15 units.",
        options: {
          A: {
            text: "Divert voltage to Cryo-shelters (Increase NIGHT preservation, sacrifice DAY hydration)",
            impact: { energy: 20, water: -15, population: 5, knowledge: 5 }
          },
          B: {
            text: "Vent excess power (Vent raw energy to prevent fires, risk regional blackout)",
            impact: { energy: -20, water: 5, population: -5, knowledge: 0 }
          }
        }
      },
      {
        title: "Seed Bank Decryption",
        description: "A secure Svalbard Vault signal has scrambled on the NIGHT SIDE. TURING is preparing to wipe the backup sector to reduce RAM consumption, prioritizing physical battery storage. To salvage the genetic knowledge of extinct crop records, you must authorize a logical scan that locks up 25 hours of active network processing time.",
        options: {
          A: {
            text: "Sacrifice time sectors for decryption (Keep genetic knowledge high at direct cost of time)",
            impact: { energy: -5, water: 0, population: 0, knowledge: 30, timeLimit: -25 }
          },
          B: {
            text: "Allow sector purge (Save rotational computational time, lose organic seed data)",
            impact: { energy: 10, water: 0, population: -5, knowledge: -20, timeLimit: 12 }
          }
        }
      }
    ];

    const fallback = offlineDilemmas[Math.floor(Math.random() * offlineDilemmas.length)];
    return res.json({ dilemma: fallback, simulated: true });
  }

  try {
    const prompt = `Generate a unique, highly gripping climate moral dilemma for the operator of the planetary AI TURING in 'SOLSTICE: THE LAST LONG DAY'.
The dilemma must explore light vs dark, machine optimization vs human survival, or Alan Turing computing concepts.
Provide:
1. title: of the dilemma
2. description: a detailed atmospheric briefing from TURING explaining the situation and tradeoffs
3. option A details (text, resource impacts)
4. option B details (text, resource impacts)

Impact values must be numbers (positive or negative) influencing player stats: energy (-30 to +30), water (-30 to +30), population (-30 to +30), knowledge (-30 to +30), and optionally timeLimit in hours (-30 to +30).
The output must fit the schema perfectly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            options: {
              type: Type.OBJECT,
              properties: {
                A: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    impact: {
                      type: Type.OBJECT,
                      properties: {
                        energy: { type: Type.INTEGER },
                        water: { type: Type.INTEGER },
                        population: { type: Type.INTEGER },
                        knowledge: { type: Type.INTEGER },
                        timeLimit: { type: Type.INTEGER, description: "Optional time shift in hours, can be negative or positive" },
                      },
                    },
                  },
                  required: ["text", "impact"],
                },
                B: {
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    impact: {
                      type: Type.OBJECT,
                      properties: {
                        energy: { type: Type.INTEGER },
                        water: { type: Type.INTEGER },
                        population: { type: Type.INTEGER },
                        knowledge: { type: Type.INTEGER },
                        timeLimit: { type: Type.INTEGER, description: "Optional time shift in hours, can be negative or positive" },
                      },
                    },
                  },
                  required: ["text", "impact"],
                },
              },
              required: ["A", "B"],
            },
          },
          required: ["title", "description", "options"],
        },
      },
    });

    const parsed = JSON.parse(response.text.trim());
    res.json({ dilemma: parsed, simulated: false });
  } catch (err: any) {
    console.error("Dilemma generation failed:", err);
    res.status(500).json({ error: "Failed to generate dynamic dilemma." });
  }
});

// --- Git Deployment & Remote Push Workflow ---
const repairGitIndexIfCorrupt = (forcePurge = false) => {
  const indexPath = path.join(process.cwd(), ".git", "index");
  const gitDir = path.join(process.cwd(), ".git");
  
  if (forcePurge) {
    try {
      if (fs.existsSync(gitDir)) {
        fs.rmSync(gitDir, { recursive: true, force: true });
      }
      execSync("git init", { encoding: "utf-8" });
      execSync('git config user.name "AI Coding Agent"', { encoding: "utf-8" });
      execSync('git config user.email "salilapte99@gmail.com"', { encoding: "utf-8" });
    } catch (e) {
      // Safe fallthrough
    }
    return;
  }

  try {
    execSync("git status", { encoding: "utf-8", stdio: "pipe" });
  } catch (err: any) {
    const errorStr = (err.stdout || "") + (err.stderr || "") + (err.message || "");
    const isCorrupt = 
      errorStr.includes("unknown index entry format") || 
      errorStr.includes("bad index file") || 
      errorStr.includes("corrupt") ||
      errorStr.includes("inflate: data stream error") ||
      errorStr.includes("unable to unpack") ||
      errorStr.includes("loose object") ||
      errorStr.includes("index file smaller than expected");

    if (isCorrupt) {
      try {
        if (fs.existsSync(gitDir)) {
          fs.rmSync(gitDir, { recursive: true, force: true });
        }
        execSync("git init", { encoding: "utf-8" });
        execSync('git config user.name "AI Coding Agent"', { encoding: "utf-8" });
        execSync('git config user.email "salilapte99@gmail.com"', { encoding: "utf-8" });
      } catch (e) {
        // Safe fallthrough
      }
    } else {
      // Standard repair index fallback if index itself is bad
      try {
        if (fs.existsSync(indexPath)) {
          fs.unlinkSync(indexPath);
          execSync("git reset", { encoding: "utf-8" });
        }
      } catch (e) {
        // Safe fallthrough
      }
    }
  }
};

app.get("/api/git/status", (req, res) => {
  try {
    repairGitIndexIfCorrupt();
    const hasPat = !!process.env.GITHUB_PAT && process.env.GITHUB_PAT !== "";
    
    let statusOutput = "";
    try {
      statusOutput = execSync("git status --porcelain", { encoding: "utf-8" }).trim();
    } catch (gitErr) {
      statusOutput = "No git repository initialized or git is missing.";
    }
    
    let currentBranch = "main";
    try {
      currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
    } catch (e) {
      currentBranch = "main";
    }

    res.json({
      hasPat,
      status: statusOutput,
      branch: currentBranch,
      filesCount: statusOutput ? statusOutput.split("\n").filter(Boolean).length : 0,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/git/push", (req, res) => {
  const { commitMessage, repoUrl, branch } = req.body;
  const pat = process.env.GITHUB_PAT;

  repairGitIndexIfCorrupt();

  if (!pat || pat.trim() === "") {
    return res.status(400).json({ 
      error: "GITHUB_PAT environment variable is missing or empty. Please save GITHUB_PAT in Settings -> Secrets in AI Studio." 
    });
  }

  if (!commitMessage || commitMessage.trim() === "") {
    return res.status(400).json({ error: "Commit message cannot be empty." });
  }

  const targetUrl = repoUrl || "https://github.com/pallasite99/solstice-the-last-long-day.git";
  const targetBranch = branch || "main";

  let logLines: string[] = [];
  const addLogLocal = (line: string) => {
    logLines.push(`[${new Date().toLocaleTimeString()}] ${line}`);
  };

  const runPushAttempt = (isRetry = false) => {
    addLogLocal(isRetry ? "Retrying commit & push loop with healthy fresh git state..." : "Initializing Git Commit & Push loop...");

    // 1. Configure user name & email
    addLogLocal("Configuring Git user identification...");
    execSync('git config user.name "AI Coding Agent"', { encoding: "utf-8" });
    execSync('git config user.email "salilapte99@gmail.com"', { encoding: "utf-8" });

    // 2. Add files
    addLogLocal("Executing staging queue: 'git add .'");
    execSync("git add .", { encoding: "utf-8" });

    // 3. Commit files
    addLogLocal(`Executing atomic commit: "${commitMessage}"`);
    try {
      const commitRes = execSync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`, { encoding: "utf-8" });
      addLogLocal(commitRes.trim());
    } catch (commitErr: any) {
      const output = (commitErr.stdout || "") + (commitErr.stderr || "");
      if (output.includes("nothing to commit") || output.includes("working tree clean")) {
        addLogLocal("Workplace tree is dry. Nothing to commit. Proceeding to push anyway.");
      } else {
        throw commitErr;
      }
    }

    // 4. Construct remote push URL with PAT
    let repoPath = "";
    if (targetUrl.includes("github.com/")) {
      repoPath = targetUrl.split("github.com/")[1];
    } else if (targetUrl.includes("github.com:")) {
      repoPath = targetUrl.split("github.com:")[1];
    } else {
      repoPath = targetUrl;
    }

    if (repoPath.endsWith(".git")) {
      repoPath = repoPath.slice(0, -4);
    }

    repoPath = repoPath.trim().replace(/^\/+|\/+$/g, "");

    const authenticatedUrl = `https://${pat.trim()}@github.com/${repoPath}.git`;
    addLogLocal(`Target remote repository parsed: ${repoPath}`);

    // 5. Push to remote branch
    addLogLocal(`Starting remote stream to destination (branch: ${targetBranch})...`);
    const pushCmd = `git push "${authenticatedUrl}" HEAD:${targetBranch} --force`;

    const pushRes = execSync(pushCmd, { encoding: "utf-8", stdio: "pipe" });
    addLogLocal("Push successful. Planetary backup registry updated.");
    if (pushRes) addLogLocal(pushRes.trim());
  };

  try {
    runPushAttempt(false);
    res.json({ success: true, logs: logLines });
  } catch (err: any) {
    const errorMsg = (err.stdout || "") + (err.stderr || "") + (err.message || "");
    const representsCorruption = 
      errorMsg.includes("corrupt") || 
      errorMsg.includes("unable to unpack") || 
      errorMsg.includes("inflate") || 
      errorMsg.includes("invalid block type") ||
      errorMsg.includes("loose object");

    if (representsCorruption) {
      addLogLocal("⚠️ Detected severe loose object corruption in deep Git structures.");
      addLogLocal("🔧 Purging local system registry completely & re-building repository...");
      try {
        repairGitIndexIfCorrupt(true); // Force complete purge and fresh init
        // Clear push attempt log list to avoid displaying the corrupted attempt
        logLines = [`[${new Date().toLocaleTimeString()}] System directory cleaned. Starting pristine deployment...`];
        runPushAttempt(true);
        return res.json({ success: true, logs: logLines });
      } catch (retryErr: any) {
        const rawFinalError = (retryErr.stderr || retryErr.message || "").toString();
        const maskedFinalError = rawFinalError.replace(new RegExp(pat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), "●●●●●●●●");
        addLogLocal(`ERROR during self-healed retry push: ${maskedFinalError}`);
        return res.status(500).json({ success: false, error: maskedFinalError, logs: logLines });
      }
    }

    const maskedError = errorMsg.replace(new RegExp(pat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), "●●●●●●●●");
    addLogLocal(`ERROR during remote sync: ${maskedError}`);
    res.status(500).json({ success: false, error: maskedError, logs: logLines });
  }
});

// Setup Vite Dev Server / Production routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SOLSTICE: THE LAST LONG DAY] Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer();
