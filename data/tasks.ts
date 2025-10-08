export interface TaskQuestion {
  id: string;
  type: 'multiple-choice' | 'text' | 'rating' | 'image-classification' | 'data-validation';
  question: string;
  options?: string[];
  imageUrl?: string;
  correctAnswer?: string; // For validation
  minLength?: number; // For text answers
}

export interface Task {
  id: string;
  title: string;
  category: 'Survey' | 'Image Annotation' | 'Data Validation' | 'Text Classification' | 'Content Moderation';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  reward: number;
  timeLimit: number; // in seconds
  estimatedTime: string;
  description: string;
  requirements: string[];
  questions: TaskQuestion[];
  qualityThreshold: number; // Minimum accuracy required
}

export const professionalTasks: Task[] = [
  {
    id: 'SRV_20241008_001',
    title: 'Product Preference Research Survey',
    category: 'Survey',
    difficulty: 'Medium',
    reward: 1.85,
    timeLimit: 480, // 8 minutes
    estimatedTime: '6-8 min',
    description: 'Answer detailed questions about product preferences and shopping habits for market research.',
    requirements: [
      'Must answer all questions honestly',
      'Minimum 3 seconds per question',
      'Text answers must be at least 30 characters',
      'Multiple quality checks included'
    ],
    qualityThreshold: 95,
    questions: [
      {
        id: 'q1',
        type: 'multiple-choice',
        question: 'How often do you purchase products online?',
        options: ['Multiple times per week', '1-2 times per week', '2-3 times per month', 'Once a month or less', 'Rarely/Never']
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        question: 'Which factor is MOST important when choosing a product?',
        options: ['Price', 'Brand reputation', 'Product reviews', 'Features/specifications', 'Return policy']
      },
      {
        id: 'q3',
        type: 'text',
        question: 'Describe your last online purchase and why you chose that specific product.',
        minLength: 50
      },
      {
        id: 'q4',
        type: 'rating',
        question: 'Rate your overall satisfaction with online shopping (1-10)',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      },
      {
        id: 'q5',
        type: 'multiple-choice',
        question: 'ATTENTION CHECK: To ensure quality, please select "Strongly Agree" for this question.',
        options: ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'],
        correctAnswer: 'Strongly Agree'
      },
      {
        id: 'q6',
        type: 'multiple-choice',
        question: 'Do you read product reviews before making a purchase?',
        options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never']
      },
      {
        id: 'q7',
        type: 'text',
        question: 'What improvements would you like to see in online shopping platforms? Be specific.',
        minLength: 50
      },
      {
        id: 'q8',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: In the paragraph above, you were asked about what?',
        options: ['Product quality', 'Shipping speed', 'Platform improvements', 'Payment methods'],
        correctAnswer: 'Platform improvements'
      }
    ]
  },
  {
    id: 'IMG_20241008_002',
    title: 'E-commerce Product Image Classification',
    category: 'Image Annotation',
    difficulty: 'Easy',
    reward: 1.20,
    timeLimit: 360, // 6 minutes
    estimatedTime: '4-6 min',
    description: 'Accurately classify product images into the correct category for e-commerce platforms.',
    requirements: [
      'Review each image carefully',
      'Select the MOST accurate category',
      'Minimum 3 seconds per image',
      'Must maintain 98%+ accuracy'
    ],
    qualityThreshold: 98,
    questions: [
      {
        id: 'img1',
        type: 'image-classification',
        question: 'Classify this product into the correct category',
        imageUrl: '/Binance.png',
        options: ['Electronics/Technology', 'Finance/Cryptocurrency', 'Clothing/Apparel', 'Home & Kitchen', 'Sports & Outdoors']
      },
      {
        id: 'img2',
        type: 'image-classification',
        question: 'Classify this product into the correct category',
        imageUrl: '/okx.png',
        options: ['Electronics/Technology', 'Finance/Cryptocurrency', 'Clothing/Apparel', 'Home & Kitchen', 'Sports & Outdoors']
      },
      {
        id: 'img3',
        type: 'image-classification',
        question: 'Classify this product into the correct category',
        imageUrl: '/Bybit.png',
        options: ['Electronics/Technology', 'Finance/Cryptocurrency', 'Clothing/Apparel', 'Home & Kitchen', 'Sports & Outdoors']
      },
      {
        id: 'img4',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: Which category did you select most frequently in this task?',
        options: ['Electronics/Technology', 'Finance/Cryptocurrency', 'Clothing/Apparel', 'Home & Kitchen'],
        correctAnswer: 'Finance/Cryptocurrency'
      }
    ]
  },
  {
    id: 'DATA_20241008_003',
    title: 'Text Content Moderation & Classification',
    category: 'Content Moderation',
    difficulty: 'Medium',
    reward: 2.15,
    timeLimit: 420, // 7 minutes
    estimatedTime: '5-7 min',
    description: 'Review and classify user-generated content for appropriateness and category.',
    requirements: [
      'Read all content thoroughly',
      'Identify policy violations',
      'Classify content accurately',
      'Zero tolerance for errors on sensitive content'
    ],
    qualityThreshold: 96,
    questions: [
      {
        id: 'mod1',
        type: 'multiple-choice',
        question: 'Review this comment: "This product is amazing! Best purchase I\'ve made this year."\nClassification:',
        options: ['Appropriate - Positive Review', 'Inappropriate - Spam', 'Inappropriate - Offensive', 'Needs Review']
      },
      {
        id: 'mod2',
        type: 'multiple-choice',
        question: 'Review this comment: "Click here for FREE products now!!!!! www.scam.com"\nClassification:',
        options: ['Appropriate - Positive Review', 'Inappropriate - Spam', 'Inappropriate - Offensive', 'Needs Review']
      },
      {
        id: 'mod3',
        type: 'multiple-choice',
        question: 'Review this comment: "Terrible service, but the product works okay."\nClassification:',
        options: ['Appropriate - Negative Review', 'Inappropriate - Spam', 'Inappropriate - Offensive', 'Needs Review']
      },
      {
        id: 'mod4',
        type: 'multiple-choice',
        question: 'ATTENTION CHECK: If you are reading carefully, select "I am paying attention"',
        options: ['Skip this question', 'Not applicable', 'I am paying attention', 'Other'],
        correctAnswer: 'I am paying attention'
      },
      {
        id: 'mod5',
        type: 'text',
        question: 'Explain why spam content should be removed from e-commerce platforms (minimum 40 characters)',
        minLength: 40
      },
      {
        id: 'mod6',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: How many pieces of content did you classify as "spam" in this task?',
        options: ['None', 'One', 'Two', 'Three or more'],
        correctAnswer: 'One'
      }
    ]
  },
  {
    id: 'TXT_20241008_004',
    title: 'Customer Review Sentiment Analysis',
    category: 'Text Classification',
    difficulty: 'Medium',
    reward: 1.95,
    timeLimit: 360, // 6 minutes
    estimatedTime: '4-6 min',
    description: 'Analyze customer reviews and accurately classify their sentiment and key topics.',
    requirements: [
      'Read entire review before classifying',
      'Consider context and tone',
      'Identify mixed sentiments',
      'High accuracy required'
    ],
    qualityThreshold: 94,
    questions: [
      {
        id: 'sent1',
        type: 'multiple-choice',
        question: 'Classify: "Product quality is excellent but shipping took forever. Disappointed."',
        options: ['Positive', 'Negative', 'Neutral', 'Mixed']
      },
      {
        id: 'sent2',
        type: 'multiple-choice',
        question: 'Classify: "Exactly what I ordered. Arrived on time. No complaints."',
        options: ['Positive', 'Negative', 'Neutral', 'Mixed']
      },
      {
        id: 'sent3',
        type: 'multiple-choice',
        question: 'Classify: "Worst purchase ever! Completely stopped working after two days."',
        options: ['Positive', 'Negative', 'Neutral', 'Mixed']
      },
      {
        id: 'sent4',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: Which sentiment did you see MOST frequently?',
        options: ['Positive', 'Negative', 'Neutral', 'Mixed'],
        correctAnswer: 'Negative'
      },
      {
        id: 'sent5',
        type: 'text',
        question: 'Describe what makes a review "mixed sentiment" versus purely negative or positive.',
        minLength: 40
      }
    ]
  },
  {
    id: 'SRV_20241008_005',
    title: 'Technology Usage Patterns Survey',
    category: 'Survey',
    difficulty: 'Hard',
    reward: 2.75,
    timeLimit: 600, // 10 minutes
    estimatedTime: '8-10 min',
    description: 'Complete an in-depth survey about technology usage, habits, and preferences.',
    requirements: [
      'Thoughtful responses required',
      'Minimum 60 characters for text answers',
      'All questions mandatory',
      'Multiple attention checks'
    ],
    qualityThreshold: 93,
    questions: [
      {
        id: 'tech1',
        type: 'multiple-choice',
        question: 'How many hours per day do you spend on digital devices?',
        options: ['Less than 2 hours', '2-4 hours', '4-6 hours', '6-8 hours', 'More than 8 hours']
      },
      {
        id: 'tech2',
        type: 'multiple-choice',
        question: 'What is your primary device for internet browsing?',
        options: ['Smartphone', 'Laptop', 'Desktop Computer', 'Tablet', 'Smart TV']
      },
      {
        id: 'tech3',
        type: 'text',
        question: 'Describe how technology has changed your work or study routine in the past year.',
        minLength: 60
      },
      {
        id: 'tech4',
        type: 'rating',
        question: 'How would you rate your technical skills? (1=Beginner, 10=Expert)',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      },
      {
        id: 'tech5',
        type: 'multiple-choice',
        question: 'ATTENTION CHECK: This is an attention check. Please select "Purple" to continue.',
        options: ['Red', 'Blue', 'Green', 'Purple', 'Yellow'],
        correctAnswer: 'Purple'
      },
      {
        id: 'tech6',
        type: 'multiple-choice',
        question: 'Which social media platform do you use most frequently?',
        options: ['Facebook', 'Instagram', 'Twitter/X', 'TikTok', 'LinkedIn', 'None']
      },
      {
        id: 'tech7',
        type: 'text',
        question: 'What concerns do you have about data privacy and security online?',
        minLength: 60
      },
      {
        id: 'tech8',
        type: 'multiple-choice',
        question: 'Do you use password managers or two-factor authentication?',
        options: ['Yes, both regularly', 'Yes, one of them', 'Rarely use them', 'No, never', 'Not sure what these are']
      },
      {
        id: 'tech9',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: This survey was primarily about what topic?',
        options: ['Shopping habits', 'Technology usage', 'Food preferences', 'Travel experiences'],
        correctAnswer: 'Technology usage'
      }
    ]
  },
  {
    id: 'DATA_20241008_006',
    title: 'Business Email Classification Task',
    category: 'Data Validation',
    difficulty: 'Hard',
    reward: 2.50,
    timeLimit: 540, // 9 minutes
    estimatedTime: '7-9 min',
    description: 'Classify business emails by urgency, category, and required action.',
    requirements: [
      'Analyze sender, subject, and full content',
      'Determine urgency level accurately',
      'Identify action items',
      'Spot phishing attempts'
    ],
    qualityThreshold: 95,
    questions: [
      {
        id: 'email1',
        type: 'multiple-choice',
        question: 'Email: "From: ceo@yourcompany.com | Subject: Q4 Report Due Tomorrow"\nUrgency Level:',
        options: ['Critical - Immediate Action', 'High - Within 24 hours', 'Medium - Within 3 days', 'Low - No deadline']
      },
      {
        id: 'email2',
        type: 'multiple-choice',
        question: 'Email: "From: newsletter@marketing.com | Subject: Weekly Tips & Tricks"\nCategory:',
        options: ['Urgent Business', 'Marketing/Newsletter', 'Personal', 'Spam/Phishing', 'Action Required']
      },
      {
        id: 'email3',
        type: 'multiple-choice',
        question: 'Email: "From: security@paypa1.com | Subject: URGENT: Verify Account"\nClassification:',
        options: ['Legitimate - High Priority', 'Legitimate - Low Priority', 'Suspicious - Possible Phishing', 'Spam']
      },
      {
        id: 'email4',
        type: 'text',
        question: 'List THREE red flags that indicate an email might be a phishing attempt.',
        minLength: 50
      },
      {
        id: 'email5',
        type: 'multiple-choice',
        question: 'ATTENTION CHECK: In the email from "paypa1.com", what was suspicious?',
        options: ['Subject line', 'Domain spelling (number 1 instead of letter l)', 'Email length', 'Nothing suspicious'],
        correctAnswer: 'Domain spelling (number 1 instead of letter l)'
      },
      {
        id: 'email6',
        type: 'multiple-choice',
        question: 'Which email required immediate action?',
        options: ['CEO Q4 Report', 'Marketing Newsletter', 'PayPal Security', 'All of them'],
        correctAnswer: 'CEO Q4 Report'
      }
    ]
  },
  {
    id: 'IMG_20241008_007',
    title: 'Image Quality Assessment & Tagging',
    category: 'Image Annotation',
    difficulty: 'Medium',
    reward: 1.65,
    timeLimit: 420, // 7 minutes
    estimatedTime: '5-7 min',
    description: 'Evaluate image quality and assign appropriate tags for machine learning datasets.',
    requirements: [
      'Assess technical quality (blur, lighting, composition)',
      'Identify all relevant objects',
      'Tag appropriately',
      'Maintain consistent standards'
    ],
    qualityThreshold: 96,
    questions: [
      {
        id: 'img1',
        type: 'image-classification',
        question: 'Rate the overall image quality',
        imageUrl: '/FORGE.png',
        options: ['Excellent - Professional quality', 'Good - Minor issues', 'Fair - Noticeable issues', 'Poor - Major issues', 'Unusable']
      },
      {
        id: 'img2',
        type: 'image-classification',
        question: 'Primary subject of this image:',
        imageUrl: '/vortex.png',
        options: ['Logo/Branding', 'Product', 'Person/People', 'Landscape/Nature', 'Abstract/Pattern']
      },
      {
        id: 'img3',
        type: 'multiple-choice',
        question: 'Which technical issue is MOST important to flag in images?',
        options: ['Slight blur', 'Poor lighting', 'Watermarks/logos', 'Low resolution', 'All equally important']
      },
      {
        id: 'img4',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: What is the primary purpose of this task?',
        options: ['Entertainment', 'Image quality assessment', 'Color matching', 'File size checking'],
        correctAnswer: 'Image quality assessment'
      },
      {
        id: 'img5',
        type: 'text',
        question: 'Describe what makes an image "high quality" for machine learning training.',
        minLength: 50
      }
    ]
  },
  {
    id: 'SRV_20241008_008',
    title: 'Consumer Behavior & Decision Making Study',
    category: 'Survey',
    difficulty: 'Hard',
    reward: 2.95,
    timeLimit: 720, // 12 minutes
    estimatedTime: '10-12 min',
    description: 'Comprehensive survey analyzing purchasing decisions, brand perception, and consumer psychology.',
    requirements: [
      'Detailed, honest responses required',
      'Text answers: minimum 80 characters',
      'Consistent responses across questions',
      'Multiple validation checks'
    ],
    qualityThreshold: 92,
    questions: [
      {
        id: 'cons1',
        type: 'multiple-choice',
        question: 'What typically triggers you to research a new product?',
        options: ['Advertisement', 'Friend recommendation', 'Specific need', 'Browsing online', 'Social media']
      },
      {
        id: 'cons2',
        type: 'rating',
        question: 'How much do brand names influence your purchasing decisions? (1=Not at all, 10=Very much)',
        options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
      },
      {
        id: 'cons3',
        type: 'text',
        question: 'Describe your research process before making a significant purchase (e.g., electronics, appliances).',
        minLength: 80
      },
      {
        id: 'cons4',
        type: 'multiple-choice',
        question: 'How important are customer reviews in your decision-making?',
        options: ['Extremely important - Won\'t buy without them', 'Very important - Usually check', 'Somewhat important', 'Not very important', 'Not important at all']
      },
      {
        id: 'cons5',
        type: 'multiple-choice',
        question: 'ATTENTION CHECK: To ensure you\'re reading carefully, select "Option C" below.',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option C'
      },
      {
        id: 'cons6',
        type: 'text',
        question: 'Explain a time when you regretted a purchase. What went wrong and what did you learn?',
        minLength: 80
      },
      {
        id: 'cons7',
        type: 'multiple-choice',
        question: 'What would make you switch from a brand you currently use?',
        options: ['Lower price', 'Better quality', 'Ethical concerns', 'Friend recommendation', 'Better features']
      },
      {
        id: 'cons8',
        type: 'multiple-choice',
        question: 'Do you comparison shop across multiple websites?',
        options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never']
      },
      {
        id: 'cons9',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: This survey focused on what aspect of consumer behavior?',
        options: ['Pricing preferences', 'Decision-making process', 'Brand loyalty only', 'Return policies'],
        correctAnswer: 'Decision-making process'
      }
    ]
  },
  {
    id: 'DATA_20241008_009',
    title: 'Address Verification & Data Quality Check',
    category: 'Data Validation',
    difficulty: 'Easy',
    reward: 0.95,
    timeLimit: 300, // 5 minutes
    estimatedTime: '3-5 min',
    description: 'Verify address accuracy and identify formatting errors in customer data.',
    requirements: [
      'Check for completeness',
      'Verify correct formatting',
      'Identify missing information',
      'Spot inconsistencies'
    ],
    qualityThreshold: 97,
    questions: [
      {
        id: 'addr1',
        type: 'multiple-choice',
        question: 'Is this address complete?\n"123 Main Street, New York, NY"',
        options: ['Yes, complete', 'No - Missing ZIP code', 'No - Missing apartment/unit', 'No - Multiple issues']
      },
      {
        id: 'addr2',
        type: 'multiple-choice',
        question: 'Check this address: "456 Oak Ave, Los Angelos, CA 90001"\nWhat needs correction?',
        options: ['Nothing, all correct', 'City name spelling', 'State abbreviation', 'ZIP code format', 'Street abbreviation']
      },
      {
        id: 'addr3',
        type: 'multiple-choice',
        question: 'QUALITY CHECK: What type of data are you validating in this task?',
        options: ['Email addresses', 'Phone numbers', 'Physical addresses', 'Credit card numbers'],
        correctAnswer: 'Physical addresses'
      },
      {
        id: 'addr4',
        type: 'multiple-choice',
        question: 'Which address component is MOST critical for mail delivery?',
        options: ['Street name', 'ZIP code', 'City name', 'State abbreviation', 'All are equally critical']
      }
    ]
  },
  {
    id: 'TXT_20241008_010',
    title: 'Content Categorization & Topic Identification',
    category: 'Text Classification',
    difficulty: 'Medium',
    reward: 1.75,
    timeLimit: 420, // 7 minutes
    estimatedTime: '5-7 min',
    description: 'Read text snippets and categorize them by topic, tone, and intent.',
    requirements: [
      'Read full content before classifying',
      'Identify primary topic',
      'Consider author intent',
      'Maintain consistency'
    ],
    qualityThreshold: 95,
    questions: [
      {
        id: 'cat1',
        type: 'multiple-choice',
        question: 'Categorize: "The new smartphone features a 108MP camera, 5G connectivity, and 12-hour battery life."\nCategory:',
        options: ['Technology/Product', 'News/Current Events', 'Opinion/Editorial', 'Tutorial/How-to', 'Entertainment']
      },
      {
        id: 'cat2',
        type: 'multiple-choice',
        question: 'Categorize: "In my opinion, electric vehicles are overrated and not worth the premium price."\nCategory:',
        options: ['News/Factual', 'Opinion/Editorial', 'Product Description', 'Tutorial', 'Question']
      },
      {
        id: 'cat3',
        type: 'text',
        question: 'Explain the difference between factual reporting and opinion-based content.',
        minLength: 50
      },
      {
        id: 'cat4',
        type: 'multiple-choice',
        question: 'ATTENTION CHECK: For quality purposes, select "Banana" from the options below.',
        options: ['Apple', 'Orange', 'Banana', 'Grape', 'Mango'],
        correctAnswer: 'Banana'
      },
      {
        id: 'cat5',
        type: 'multiple-choice',
        question: 'Which text was clearly opinion-based?',
        options: ['The smartphone specification', 'The electric vehicle comment', 'Both', 'Neither'],
        correctAnswer: 'The electric vehicle comment'
      }
    ]
  }
];

export function getAvailableTasks(): Task[] {
  // Return 2-4 random tasks
  const shuffled = [...professionalTasks].sort(() => 0.5 - Math.random());
  const count = Math.floor(Math.random() * 3) + 2; // 2-4 tasks
  return shuffled.slice(0, count);
}

export function getTaskById(id: string): Task | undefined {
  return professionalTasks.find(task => task.id === id);
}