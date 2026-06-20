export interface TuringPuzzle {
  id: string;
  cipherText: string;
  solution: string;
  difficulty: "Easy" | "Medium" | "Hard";
  title: string;
  instruction: string;
  context: string;
}

export const turingPuzzlesList: TuringPuzzle[] = [
  {
    id: "tp_01",
    title: "1. The Bitwise XOR Gate",
    cipherText: "10101100 XOR 11001100",
    solution: "01100000",
    difficulty: "Easy",
    instruction: "Calculate the Bitwise XOR result. Rule: If digits are identical (1/1, 0/0) write 0, otherwise write 1.",
    context: "Fundamental logic gate used in Turing-Complete hardware buses to compute states without carry delay."
  },
  {
    id: "tp_02",
    title: "2. The Bletchley Shift (ROT13)",
    cipherText: "ROT13: NYNA_GHEVAT",
    solution: "ALAN_TURING",
    difficulty: "Easy",
    instruction: "Rotate each English alphabetical character by 13 places. (A becomes N, L becomes Y, etc. Keep underscores).",
    context: "The simple Caesar shift variant that Bletchley Park codebreakers used as basic testing checks for fresh recruits."
  },
  {
    id: "tp_03",
    title: "3. Binary ASCII Translation",
    cipherText: "ASCII: 01001000 01001111 01010000 01000101",
    solution: "HOPE",
    difficulty: "Medium",
    instruction: "Translate these byte structures into upper-case characters. (01001000 = H, 01001111 = O, 01010000 = P, 01000101 = E)",
    context: "Translates standard electric machine voltage lines into legible human words."
  },
  {
    id: "tp_04",
    title: "4. The Turing Tape State Machine",
    cipherText: "Tape: 0_1_0_1 -> Rule: Flip all bits. Answer with final tape digits separated by underscores.",
    solution: "1_0_1_0",
    difficulty: "Easy",
    instruction: "Read the tape list '0_1_0_1' and execute the rule: 'Flip all bits' to secure the output sequence.",
    context: "Mimics the action check of a multi-state tape head rewriting binary values."
  },
  {
    id: "tp_05",
    title: "5. BCD (Binary Coded Decimal)",
    cipherText: "BCD: 0100 0010",
    solution: "42",
    difficulty: "Easy",
    instruction: "Convert each 4-bit block into its decimal integer value. Write the combined integer digits.",
    context: "Early computer architectures represented base-10 numerical indicators directly as individual 4-bit blocks."
  },
  {
    id: "tp_06",
    title: "6. Character Offset Cipher",
    cipherText: "SHIFT-3: KHOOR_ZRUOG",
    solution: "HELLO_WORLD",
    difficulty: "Medium",
    instruction: "Shift each character backward in the alphabet by exactly 3 places. Standard Caesar cipher decryption.",
    context: "An early mechanical encryption standard used prior to the invention of multi-rotor systems."
  },
  {
    id: "tp_07",
    title: "7. Hexadecimal Memory Dump",
    cipherText: "HEX: 41 49",
    solution: "AI",
    difficulty: "Easy",
    instruction: "Convert the hex addresses into ASCII characters. (41 in Hex = 65 in Decimal = 'A'; 49 in Hex = 73 in Decimal = 'I')",
    context: "Inspecting raw hardware indices directly in high-density RAM chips."
  },
  {
    id: "tp_08",
    title: "8. Binary Addition Check",
    cipherText: "ADD: 0110 + 1001",
    solution: "1111",
    difficulty: "Easy",
    instruction: "Add the two binary numbers together. Express the answer as a four-digit binary string.",
    context: "Simple arithmetic logic units (ALU) perform binary addition using silicon flip-flops."
  },
  {
    id: "tp_09",
    title: "9. Bit-Shift Left Operation",
    cipherText: "SHIFT-L: 00110100",
    solution: "01101000",
    difficulty: "Medium",
    instruction: "Shift all bits to the left by 1 position (padding with 0 on the far right).",
    context: "Bitwise left shift acts as a rapid mathematical multiplication by 2."
  },
  {
    id: "tp_10",
    title: "10. One-Time Pad Logic",
    cipherText: "Cipher: 1010, Key: 0110 (XOR Encrypted)",
    solution: "1100",
    difficulty: "Medium",
    instruction: "Decrypt the ciphertext with the given key using bitwise XOR protocol.",
    context: "Turing researched the One-Time Pad, which is mathematically unbreakable if the key is truly random."
  },
  {
    id: "tp_11",
    title: "11. Morse Communications Signal",
    cipherText: "MORSE: - ..- .-. .. -. --.",
    solution: "TURING",
    difficulty: "Medium",
    instruction: "Translate Morse telegraph sounds to a standard uppercase word. (- = T, ..- = U, .-. = R, .. = I, -. = N, --. = G)",
    context: "Telegraph lines were the critical physical vectors for intelligence logistics."
  },
  {
    id: "tp_12",
    title: "12. Base-3 Ternary Converter",
    cipherText: "Ternary: 102 (Base-3)",
    solution: "11",
    difficulty: "Medium",
    instruction: "Convert ternary base-3 representation 102 to decimal. Calculation: (1 * 3^2) + (0 * 3^1) + (2 * 3^0).",
    context: "Ternary represents a non-binary logic structure that Turing's colleagues experimented with."
  },
  {
    id: "tp_13",
    title: "13. Odd Parity Vector Checker",
    cipherText: "Is 1101101 Odd Parity? (Type YES or NO)",
    solution: "YES",
    difficulty: "Easy",
    instruction: "Check if the binary string holds an ODD number of 1s (to check transmission line parity checks).",
    context: "Turing designed error-correction matrices to verify memory tapes."
  },
  {
    id: "tp_14",
    title: "14. Run-Length RLE Decompressor",
    cipherText: "RLE: 3A 2B 4C",
    solution: "AAABBCCCC",
    difficulty: "Medium",
    instruction: "Decompress the data: replicate character by the preceding count. (e.g. 3A means AAA).",
    context: "One of the earliest digital compression algorithms to maximize file spaces."
  },
  {
    id: "tp_15",
    title: "15. Enigma Ring Setting Offset",
    cipherText: "Char 'D' + Ring setting offset (+4)",
    solution: "H",
    difficulty: "Easy",
    instruction: "Shift character 'D' forward in the standard alphabet by 4 positions.",
    context: "Ring settings (Ringstellung) physically shifted Enigma internal rotors relative to inner wiring."
  },
  {
    id: "tp_16",
    title: "16. Binary Masking AND operation",
    cipherText: "1101 AND 1011",
    solution: "1001",
    difficulty: "Medium",
    instruction: "Solve the bitwise AND logic. Output 1 only if BOTH corresponding bits are 1.",
    context: "Used to selectively clear or isolate specific status flags in register banks."
  },
  {
    id: "tp_17",
    title: "17. The Halting Paradox Code",
    cipherText: "X = NOT(X). If X is false, X becomes: (Type TRUE or FALSE)",
    solution: "TRUE",
    difficulty: "Easy",
    instruction: "Solve the basic negation parameter state.",
    context: "Reflects basic logical contradictions that inspired Turing's proof on uncomputability."
  },
  {
    id: "tp_18",
    title: "18. Fibonacci Register Index",
    cipherText: "Fibonacci: 1, 1, 2, 3, 5, 8, ?, 21",
    solution: "13",
    difficulty: "Easy",
    instruction: "Find the missing integer digit '?' in standard Fibonacci recursion sequences.",
    context: "Calculates biological structural patterns discovered by Turing in morphogenesis research."
  },
  {
    id: "tp_19",
    title: "19. Left Circular Rotator Shift (NOT)",
    cipherText: "ROT-L 4bit: 1000",
    solution: "0001",
    difficulty: "Hard",
    instruction: "Rotate all bits left by 1 position, moving the left-most bit into the right-most slot.",
    context: "Symmetric key cryptographic algorithms utilize circular shifts to continuously scramble input matrices."
  },
  {
    id: "tp_20",
    title: "20. The Collatz Conjecture Step",
    cipherText: "If N = 6 (Even -> N/2), next value is:",
    solution: "3",
    difficulty: "Easy",
    instruction: "Apply the algorithm: if even, return half of N. What is the next output integer?",
    context: "A famous simple arithmetic sequence whose halting state remains mathematically unproven."
  }
];
