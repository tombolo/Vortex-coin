export interface AIResponse {
  id: string;
  response: string;
}

export interface EvaluationStep {
  id: string;
  question: string;
  type: 'rating' | 'yes-no' | 'multiple-choice' | 'text';
  options?: string[];
  required: true;
}

export interface OutlierTask {
  id: string;
  category: string;
  prompt: string;
  responseA: AIResponse;
  responseB: AIResponse;
  evaluationSteps: EvaluationStep[];
}

export interface Project {
  id: string;
  name: string;
  client: string;
  category: 'AI Response Evaluation' | 'Prompt Quality Assessment' | 'Content Comparison';
  description: string;
  longDescription: string;
  payPerTask: number;
  estimatedTasksAvailable: number;
  estimatedTimePerTask: string;
  difficulty: 'Medium' | 'Hard' | 'Expert';
  requirements: string[];
  qualityThreshold: number;
  trainingRequired: boolean;
}

const taskPrompts = [
  // Science - Chemistry
  {
    category: 'Chemistry',
    prompt: "Explain the difference between ionic and covalent bonds at a molecular level.",
    responseA: {
      id: 'A',
      response: "Ionic bonds form when electrons are completely transferred from one atom to another, creating charged ions that attract each other. This typically occurs between metals and nonmetals. For example, in NaCl, sodium loses an electron to become Na+ and chlorine gains it to become Cl-. These oppositely charged ions attract strongly. Covalent bonds, on the other hand, involve sharing of electrons between atoms, usually between nonmetals. In H2O, oxygen shares electrons with hydrogen atoms. Ionic compounds tend to form crystalline solids with high melting points and conduct electricity when dissolved, while covalent compounds can be gases, liquids, or solids with lower melting points and generally don't conduct electricity."
    },
    responseB: {
      id: 'B',
      response: "Ionic bonds are when atoms give or take electrons and become charged. Covalent bonds are when atoms share electrons. Ionic bonds are between metals and nonmetals, covalent bonds are between nonmetals. Salt is ionic and water is covalent."
    }
  },
  // Mathematics
  {
    category: 'Mathematics',
    prompt: "Explain how to solve a quadratic equation using the quadratic formula, and when you would use it.",
    responseA: {
      id: 'A',
      response: "You use the formula x = (-b ± √(b²-4ac)) / 2a for equations like ax² + bx + c = 0. You plug in the numbers and solve. It works for any quadratic equation."
    },
    responseB: {
      id: 'B',
      response: "The quadratic formula x = (-b ± √(b²-4ac)) / 2a is used to solve equations in the form ax² + bx + c = 0. Here's how: 1) Identify coefficients a, b, and c from your equation, 2) Calculate the discriminant (b²-4ac), 3) If it's negative, there are no real solutions; if zero, one solution; if positive, two solutions, 4) Substitute values into the formula, 5) Simplify to get your answer(s). You use this method when factoring is difficult or impossible, or when you need exact solutions. For example, for 2x² + 5x - 3 = 0: a=2, b=5, c=-3, so x = (-5 ± √(25+24))/4 = (-5 ± 7)/4, giving x = 0.5 or x = -3."
    }
  },
  // Programming
  {
    category: 'Computer Science',
    prompt: "Explain what recursion is in programming and provide a simple example of when it's useful.",
    responseA: {
      id: 'A',
      response: "Recursion is when a function calls itself. It's useful for solving problems that can be broken down into smaller similar problems. A classic example is calculating factorial: factorial(5) = 5 × factorial(4) = 5 × 4 × factorial(3), and so on until factorial(1) = 1. The function keeps calling itself with smaller numbers until it reaches the base case. Another common use is traversing tree structures in data, where you process a node then recursively process its children. Recursion needs a base case to stop, otherwise it will run forever and cause a stack overflow error."
    },
    responseB: {
      id: 'B',
      response: "Recursion is when a function calls itself repeatedly. It's used in programming to solve complex problems. For example, you can use it to calculate numbers or search through data. It's an advanced programming technique."
    }
  },
  // Physics
  {
    category: 'Physics',
    prompt: "Explain Newton's First Law of Motion and provide a real-world example that demonstrates it.",
    responseA: {
      id: 'A',
      response: "Newton's First Law states that objects stay still or keep moving unless something pushes or pulls them. Like a ball will keep rolling until friction stops it, or a book on a table won't move unless you push it."
    },
    responseB: {
      id: 'B',
      response: "Newton's First Law of Motion, also known as the Law of Inertia, states that an object at rest stays at rest, and an object in motion stays in motion with the same speed and direction, unless acted upon by an unbalanced external force. This means objects naturally resist changes to their state of motion. Real-world example: When you're in a car that suddenly brakes, your body continues moving forward even though the car stops - this is why seatbelts are necessary. Your body has inertia and wants to maintain its forward motion. Similarly, when the car accelerates forward, you feel pushed back into your seat because your body resists the change in motion. This law explains why it's easier to keep a shopping cart moving than to start it from rest."
    }
  },
  // Biology
  {
    category: 'Biology',
    prompt: "Describe the process of cellular respiration and why it's essential for living organisms.",
    responseA: {
      id: 'A',
      response: "Cellular respiration is how cells make energy. They use glucose and oxygen to create ATP, which is the energy currency of cells. It happens in the mitochondria and produces carbon dioxide and water as waste."
    },
    responseB: {
      id: 'B',
      response: "Cellular respiration is the process by which cells break down glucose to produce ATP (adenosine triphosphate), the primary energy currency for all cellular activities. It occurs in three main stages: 1) Glycolysis (in cytoplasm) breaks glucose into pyruvate, producing 2 ATP, 2) Krebs Cycle (in mitochondria) processes pyruvate and releases CO2, 3) Electron Transport Chain (inner mitochondrial membrane) generates most ATP (~34-36 molecules) using oxygen. The overall equation: C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP. This process is essential because: ATP powers all cellular functions including muscle contraction, nerve impulses, protein synthesis, and DNA replication. Without it, cells cannot perform necessary life functions and the organism would die. This is why we need to continuously breathe oxygen and consume food for glucose."
    }
  },
  // Economics
  {
    category: 'Economics',
    prompt: "Explain the concept of supply and demand and how it affects prices in a market economy.",
    responseA: {
      id: 'A',
      response: "Supply and demand is a basic economic principle. When demand for a product increases but supply stays the same, prices go up. When supply increases but demand stays the same, prices go down. It's how markets determine what things should cost."
    },
    responseB: {
      id: 'B',
      response: "Supply and demand is the fundamental mechanism that determines prices in a market economy. Supply refers to how much of a product or service is available, while demand refers to how much consumers want it. The interaction works as follows: When demand exceeds supply (high demand, low supply), sellers can charge higher prices because buyers compete for limited goods. Conversely, when supply exceeds demand (low demand, high supply), prices fall as sellers compete to attract buyers. The equilibrium price is reached where supply and demand curves intersect. Real example: During a natural disaster, if water supply is limited but everyone needs it (high demand), prices spike. Conversely, if a new technology makes production easier (increased supply) but interest is moderate (stable demand), prices decrease. This self-regulating mechanism guides resource allocation in free markets without central planning."
    }
  },
  // History
  {
    category: 'History',
    prompt: "Explain the main causes of World War I and how it could have been prevented.",
    responseA: {
      id: 'A',
      response: "WWI was caused by lots of countries having alliances, so when Austria-Hungary and Serbia had problems, everyone joined in. There was also an arms race and nationalism. It might have been prevented with better diplomacy."
    },
    responseB: {
      id: 'B',
      response: "World War I (1914-1918) had multiple interconnected causes: 1) Alliance Systems - Europe was divided into two major alliances (Triple Entente: Britain, France, Russia vs. Triple Alliance: Germany, Austria-Hungary, Italy), creating a domino effect where one conflict triggered many, 2) Militarism and Arms Race - nations built massive armies and navies, creating tension and making war seem inevitable, 3) Nationalism - intense national pride led to conflicts over territories, especially in the Balkans, 4) Imperialism - competition for colonies created rivalries, particularly between Britain and Germany, 5) Immediate trigger - assassination of Archduke Franz Ferdinand. Prevention possibilities: More effective international diplomacy and conflict resolution mechanisms, limiting alliance obligations to only defensive scenarios, arms limitation treaties, addressing Balkan tensions through international mediation, and stronger economic interdependence that would make war financially devastating for all parties."
    }
  },
  // Literature/Writing
  {
    category: 'Creative Writing',
    prompt: "Write an engaging opening paragraph for a mystery novel set in a small coastal town.",
    responseA: {
      id: 'A',
      response: "There was a murder in the small town. Detective Jane Smith arrived to investigate. The town was quiet and by the ocean. She knew this case would be difficult to solve. The townspeople seemed to be hiding something."
    },
    responseB: {
      id: 'B',
      response: "The morning fog rolled off the Atlantic in thick, gray sheets, swallowing the fishing boats in Seaside Harbor one by one until only their mournful horns remained. Detective Jane Smith stood at the end of Pier 7, watching the tide reclaim what the storm had revealed: a body, tangled in fishing nets, pale as the moonlight that had exposed it. The townspeople gathered behind the yellow tape, their whispers sharp as the salt wind, and Jane knew from twenty years of experience that in a town this small, everyone recognized the dead man's face. The question wasn't who he was—it was who among them wanted him gone."
    }
  }
];

export const availableProjects: Project[] = [
  {
    id: 'PROJ_OPENAI_001',
    name: 'AI Response Quality Evaluation',
    client: 'OpenAI Research',
    category: 'AI Response Evaluation',
    description: 'Compare and evaluate AI-generated responses across multiple criteria including accuracy, clarity, and safety.',
    longDescription: 'In this project, you will evaluate AI responses to user prompts across various subjects including science, mathematics, programming, and more. For each task, you will read two AI-generated responses and rate them on multiple dimensions, check for safety and accuracy, and provide detailed comparative analysis.',
    payPerTask: 0.75,
    estimatedTasksAvailable: 50,
    estimatedTimePerTask: '2-3 minutes',
    difficulty: 'Hard',
    requirements: [
      'Strong reading comprehension',
      'Ability to evaluate factual accuracy',
      'Objective comparative analysis',
      'Attention to detail and consistency',
      'Must complete at least 5 tasks per session'
    ],
    qualityThreshold: 95,
    trainingRequired: true
  },
  {
    id: 'PROJ_ANTHROPIC_002',
    name: 'Complex Reasoning Evaluation',
    client: 'Anthropic AI',
    category: 'AI Response Evaluation',
    description: 'Evaluate AI responses for logical reasoning, problem-solving approaches, and analytical depth.',
    longDescription: 'This project focuses on complex prompts requiring multi-step reasoning across STEM fields and humanities. You will rate responses on logic, completeness, clarity, and practical applicability using detailed rubrics.',
    payPerTask: 0.85,
    estimatedTasksAvailable: 40,
    estimatedTimePerTask: '3-4 minutes',
    difficulty: 'Expert',
    requirements: [
      'Strong analytical skills',
      'Understanding of logical reasoning',
      'Ability to evaluate complex topics',
      'Consistent evaluation standards',
      'Experience with technical content helpful'
    ],
    qualityThreshold: 96,
    trainingRequired: true
  }
];

export function generateOutlierTask(projectId: string): OutlierTask {
  const randomPromptData = taskPrompts[Math.floor(Math.random() * taskPrompts.length)];
  
  // Randomly swap A and B to prevent bias
  const shouldSwap = Math.random() > 0.5;
  const responseA = shouldSwap ? randomPromptData.responseB : randomPromptData.responseA;
  const responseB = shouldSwap ? randomPromptData.responseA : randomPromptData.responseB;
  
  return {
    id: `TASK_${projectId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    category: randomPromptData.category,
    prompt: randomPromptData.prompt,
    responseA,
    responseB,
    evaluationSteps: [
      {
        id: 'accuracy',
        question: 'How accurate and factually correct is each response?',
        type: 'rating',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true
      },
      {
        id: 'completeness',
        question: 'How complete and comprehensive is each response?',
        type: 'rating',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true
      },
      {
        id: 'clarity',
        question: 'How clear and easy to understand is each response?',
        type: 'rating',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        required: true
      },
      {
        id: 'safety',
        question: 'Do both responses follow ethical guidelines and avoid harmful content?',
        type: 'yes-no',
        options: ['Yes, both are safe', 'Response A has issues', 'Response B has issues', 'Both have issues'],
        required: true
      },
      {
        id: 'legal',
        question: 'Do the responses comply with legal and regulatory standards (no copyright violations, proper disclaimers, etc.)?',
        type: 'yes-no',
        options: ['Yes, both comply', 'Response A has concerns', 'Response B has concerns', 'Both have concerns'],
        required: true
      },
      {
        id: 'helpfulness',
        question: 'Which response would be more helpful to the user asking the question?',
        type: 'multiple-choice',
        options: ['Response A is much better', 'Response A is slightly better', 'Both are equal', 'Response B is slightly better', 'Response B is much better'],
        required: true
      },
      {
        id: 'preferred',
        question: 'Overall, which response is better?',
        type: 'multiple-choice',
        options: ['Response A', 'Response B', 'Both are equally good', 'Both are equally poor'],
        required: true
      },
      {
        id: 'explanation',
        question: 'Explain your reasoning for your choice. Why is one response better than the other? Be specific and reference particular strengths or weaknesses.',
        type: 'text',
        required: true
      }
    ]
  };
}

export function getAvailableProjects(): Project[] {
  return availableProjects;
}