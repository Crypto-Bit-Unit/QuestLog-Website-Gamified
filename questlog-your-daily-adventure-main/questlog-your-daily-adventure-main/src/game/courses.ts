export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number; // index
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  intro: string;
  questions: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  emoji: string;
  category: "Logic" | "Math" | "Code" | "Mind" | "Money" | "Writing" | "Science";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  blurb: string;
  xpPerQuestion: number;
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    id: "logic-101",
    title: "Logic & Critical Thinking",
    emoji: "🧠",
    category: "Logic",
    difficulty: "Beginner",
    blurb: "Spot fallacies, reason cleanly, and argue with precision.",
    xpPerQuestion: 8,
    lessons: [
      {
        id: "l1",
        title: "Deduction vs Induction",
        intro: "Deduction guarantees truth from premises. Induction infers likely truth from patterns.",
        questions: [
          {
            q: "All birds have feathers. A robin is a bird. Therefore a robin has feathers. This is:",
            options: ["Inductive", "Deductive", "Abductive", "A fallacy"],
            answer: 1,
            explain: "Conclusion follows necessarily from premises — classic deduction.",
          },
          {
            q: "Every swan I've seen is white, so all swans are white. This is:",
            options: ["Deductive", "Inductive", "Valid", "Sound"],
            answer: 1,
            explain: "Generalizing from observed cases is induction — and notably, this conclusion is false (black swans exist).",
          },
          {
            q: "Which fallacy is 'You can't trust his argument because he's rich'?",
            options: ["Straw man", "Ad hominem", "Slippery slope", "Appeal to authority"],
            answer: 1,
            explain: "Attacking the person rather than the argument is ad hominem.",
          },
        ],
      },
      {
        id: "l2",
        title: "Common Fallacies",
        intro: "Bad arguments hide in plain sight. Learn the patterns.",
        questions: [
          {
            q: "'If we allow this, soon everything will collapse.' What fallacy?",
            options: ["Slippery slope", "False dichotomy", "Circular reasoning", "Red herring"],
            answer: 0,
            explain: "Claiming one step leads inevitably to disaster, without evidence, is the slippery slope.",
          },
          {
            q: "'You're either with us or against us.' What fallacy?",
            options: ["Ad hominem", "False dichotomy", "Strawman", "Appeal to emotion"],
            answer: 1,
            explain: "Reducing options to two when more exist is a false dichotomy.",
          },
        ],
      },
    ],
  },
  {
    id: "math-pareto",
    title: "Math: The 80/20 Principle",
    emoji: "📐",
    category: "Math",
    difficulty: "Beginner",
    blurb: "The Pareto distribution rules nature, business, and your day.",
    xpPerQuestion: 10,
    lessons: [
      {
        id: "l1",
        title: "What is 80/20?",
        intro: "Roughly 80% of effects come from 20% of causes. Power laws, not bell curves.",
        questions: [
          {
            q: "If 20% of customers produce 80% of revenue, what should you do first?",
            options: ["Acquire more low-value customers", "Identify and serve the top 20%", "Lower prices for everyone", "Discontinue the product"],
            answer: 1,
            explain: "Pareto thinking: focus disproportionate effort on the disproportionately impactful slice.",
          },
          {
            q: "A power law differs from a normal distribution because it has:",
            options: ["A symmetric peak", "A long fat tail", "No outliers", "A fixed mean"],
            answer: 1,
            explain: "Power laws have heavy tails — extreme values are far more common than in a Gaussian.",
          },
        ],
      },
    ],
  },
  {
    id: "python-builders",
    title: "Python for Builders",
    emoji: "🐍",
    category: "Code",
    difficulty: "Intermediate",
    blurb: "Ship working scripts. Loops, comprehensions, files, APIs.",
    xpPerQuestion: 12,
    lessons: [
      {
        id: "l1",
        title: "List Comprehensions",
        intro: "[x*2 for x in nums if x > 0] — concise, fast, Pythonic.",
        questions: [
          {
            q: "What does [x**2 for x in range(4)] produce?",
            options: ["[0, 1, 2, 3]", "[1, 4, 9, 16]", "[0, 1, 4, 9]", "[2, 4, 6, 8]"],
            answer: 2,
            explain: "range(4) is 0,1,2,3 — squared gives 0,1,4,9.",
          },
          {
            q: "Which is a generator (lazy) instead of a list?",
            options: ["[x for x in r]", "(x for x in r)", "{x for x in r}", "list(r)"],
            answer: 1,
            explain: "Parentheses create a generator expression — values produced on demand.",
          },
        ],
      },
    ],
  },
  {
    id: "psychology-flow",
    title: "Cognitive Psychology",
    emoji: "🧪",
    category: "Mind",
    difficulty: "Beginner",
    blurb: "Flow, attention, memory — the operating system of your mind.",
    xpPerQuestion: 8,
    lessons: [
      {
        id: "l1",
        title: "Flow State",
        intro: "Flow appears when challenge meets skill — full immersion, lost time, peak output.",
        questions: [
          {
            q: "Flow is most likely when challenge is:",
            options: ["Far above your skill", "Far below your skill", "Slightly above your skill", "Random"],
            answer: 2,
            explain: "Csikszentmihalyi: skill stretched just past comfort = flow channel.",
          },
          {
            q: "Working memory holds roughly how many items?",
            options: ["2", "4±1", "10", "Unlimited"],
            answer: 1,
            explain: "Modern estimates put working memory at about 4 chunks — not Miller's old 7±2.",
          },
        ],
      },
    ],
  },
  {
    id: "finance-iq",
    title: "Financial Intelligence",
    emoji: "💰",
    category: "Money",
    difficulty: "Beginner",
    blurb: "Compounding, assets vs liabilities, runway thinking.",
    xpPerQuestion: 10,
    lessons: [
      {
        id: "l1",
        title: "Compounding",
        intro: "Money earning money earning money. Time is the magic ingredient.",
        questions: [
          {
            q: "$1,000 at 10% annual compounded for 30 years is roughly:",
            options: ["$4,000", "$10,000", "$17,500", "$100,000"],
            answer: 2,
            explain: "1.1^30 ≈ 17.45, so $17,449. Compounding crushes intuition.",
          },
          {
            q: "Rule of 72 says money doubles in years equal to 72 / interest rate. At 8%:",
            options: ["3 years", "6 years", "9 years", "12 years"],
            answer: 2,
            explain: "72 / 8 = 9 years. Quick mental check.",
          },
        ],
      },
    ],
  },
  {
    id: "writing-mastery",
    title: "Writing Mastery",
    emoji: "✍️",
    category: "Writing",
    difficulty: "Intermediate",
    blurb: "Clarity beats cleverness. Cut, sharpen, ship.",
    xpPerQuestion: 8,
    lessons: [
      {
        id: "l1",
        title: "Cut Ruthlessly",
        intro: "Most prose has 30% fat. Trim until every word earns its place.",
        questions: [
          {
            q: "Which sentence is strongest?",
            options: [
              "It is important to note that we should consider acting soon.",
              "We should act soon.",
              "Acting soon is something we ought to potentially consider.",
              "Action, in our view, may perhaps be warranted.",
            ],
            answer: 1,
            explain: "Three words. Same meaning. Active voice. Direct.",
          },
        ],
      },
    ],
  },
  {
    id: "cs-data",
    title: "Data Structures",
    emoji: "🧱",
    category: "Code",
    difficulty: "Intermediate",
    blurb: "Arrays, hashmaps, trees — pick the right tool, win the problem.",
    xpPerQuestion: 12,
    lessons: [
      {
        id: "l1",
        title: "Big-O Basics",
        intro: "How does runtime grow with input? O(1), O(log n), O(n), O(n²)…",
        questions: [
          {
            q: "Looking up a key in a hashmap is typically:",
            options: ["O(n)", "O(log n)", "O(1)", "O(n²)"],
            answer: 2,
            explain: "Average case is constant time — that's why hashmaps are everywhere.",
          },
          {
            q: "Binary search on a sorted array is:",
            options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
            answer: 1,
            explain: "Each step halves the search space — logarithmic.",
          },
        ],
      },
    ],
  },
  {
    id: "quantum",
    title: "Quantum Physics",
    emoji: "⚛️",
    category: "Science",
    difficulty: "Advanced",
    blurb: "Superposition, entanglement, measurement. The strange truth.",
    xpPerQuestion: 14,
    lessons: [
      {
        id: "l1",
        title: "Superposition",
        intro: "A quantum system can be in multiple states at once — until measured.",
        questions: [
          {
            q: "Schrödinger's cat thought experiment illustrates:",
            options: ["Time dilation", "Superposition until observation", "Quantum tunneling", "Entanglement"],
            answer: 1,
            explain: "Until observed, the cat is in a superposition of alive AND dead — absurd at human scale, real at quantum scale.",
          },
          {
            q: "Two entangled particles: measuring one instantly determines:",
            options: ["Nothing about the other", "The state of the other", "Their combined mass", "Their wavelength"],
            answer: 1,
            explain: "Entanglement: outcomes are correlated across any distance — Einstein called it 'spooky action at a distance'.",
          },
        ],
      },
    ],
  },
];

export const FEED_ITEMS = [
  {
    id: "f1",
    type: "Article",
    title: "Deep Work in a Distracted World",
    author: "Cal Newport",
    minutes: 7,
    category: "Mind",
    xp: 15,
    cover: "🎯",
    excerpt: "Why the ability to focus without distraction is becoming the superpower of the 21st century.",
  },
  {
    id: "f2",
    type: "Article",
    title: "The Compounding Career",
    author: "Naval Ravikant",
    minutes: 5,
    category: "Money",
    xp: 12,
    cover: "📈",
    excerpt: "Skills, reputation, and money all compound. Pick what to compound carefully.",
  },
  {
    id: "f3",
    type: "Video",
    title: "How to Learn Anything Fast",
    author: "Josh Kaufman",
    minutes: 18,
    category: "Mind",
    xp: 25,
    cover: "🎬",
    excerpt: "The first 20 hours decide whether a new skill sticks. Here's the deliberate-practice method.",
  },
  {
    id: "f4",
    type: "Podcast",
    title: "First Principles Thinking",
    author: "Shane Parrish",
    minutes: 42,
    category: "Logic",
    xp: 35,
    cover: "🎙️",
    excerpt: "Strip problems to fundamental truths and reason up — the method that built SpaceX.",
  },
  {
    id: "f5",
    type: "Article",
    title: "The Anatomy of a Habit Loop",
    author: "James Clear",
    minutes: 6,
    category: "Mind",
    xp: 14,
    cover: "🔁",
    excerpt: "Cue → craving → response → reward. Engineer the loop, engineer your life.",
  },
  {
    id: "f6",
    type: "Article",
    title: "Why Most Code Is Wrong",
    author: "John Carmack",
    minutes: 9,
    category: "Code",
    xp: 18,
    cover: "💻",
    excerpt: "On simplicity, defensive programming, and the cost of cleverness.",
  },
  {
    id: "f7",
    type: "Video",
    title: "The Pareto Principle Explained",
    author: "Tim Ferriss",
    minutes: 11,
    category: "Money",
    xp: 20,
    cover: "📊",
    excerpt: "80% of results from 20% of effort — applied to fitness, business, and relationships.",
  },
  {
    id: "f8",
    type: "Article",
    title: "Writing Is Thinking",
    author: "Paul Graham",
    minutes: 8,
    category: "Writing",
    xp: 16,
    cover: "✒️",
    excerpt: "If you can't write clearly, you probably can't think clearly. The cure is more writing.",
  },
] as const;

export type FeedItem = (typeof FEED_ITEMS)[number];
