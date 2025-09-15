export interface Candidate {
  id: string;
  name: string;
  email: string;
  organization: string;
  location: string;
  testCenter: string;
  status: 'active' | 'completed' | 'flagged' | 'suspended';
  lastActivity: string;
  testsCompleted: number;
  averageScore: number;
  timeSpent: string;
  suspiciousActivity: number;
  profileImage?: string;
  phone: string;
  joinDate: string;
  department: string;
  position: string;
  testHistory: TestResult[];
  verificationStatuses: {
    preTestForensics: 'passed' | 'failed' | 'pending' | 'not-started';
    identityVerification: 'passed' | 'failed' | 'pending' | 'not-started';
    biometricEnrollment: 'passed' | 'failed' | 'pending' | 'not-started';
    documentVerification: 'passed' | 'failed' | 'pending' | 'not-started';
  };
}

export interface TestResult {
  id: string;
  testName: string;
  date: string;
  score: number;
  duration: string;
  status: 'completed' | 'flagged' | 'incomplete';
  flags: string[];
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  candidateCount: number;
  testsActive: number;
  averageScore: number;
  flaggedCandidates: number;
}

export interface Location {
  id: string;
  city: string;
  country: string;
  candidateCount: number;
  testCenters: number;
  averageScore: number;
}

export interface TestCenter {
  id: string;
  name: string;
  location: string;
  capacity: number;
  activeTests: number;
  candidateCount: number;
  equipment: string[];
  supervisor: string;
}

export const mockCandidates: Candidate[] = [
  {
    id: "C001",
    name: "Sarah Johnson",
    email: "sarah.johnson@techcorp.com",
    organization: "TechCorp Industries",
    location: "New York, USA",
    testCenter: "Manhattan Testing Center",
    status: "active",
    lastActivity: "2024-01-15T10:30:00Z",
    testsCompleted: 5,
    averageScore: 87.5,
    timeSpent: "3h 45m",
    suspiciousActivity: 0,
    phone: "+1-555-0123",
    joinDate: "2023-12-01",
    department: "Engineering",
    position: "Senior Developer",
    testHistory: [
      {
        id: "T001",
        testName: "JavaScript Fundamentals",
        date: "2024-01-15T09:00:00Z",
        score: 92,
        duration: "45m",
        status: "completed",
        flags: []
      },
      {
        id: "T002",
        testName: "React Advanced",
        date: "2024-01-10T14:00:00Z",
        score: 88,
        duration: "60m",
        status: "completed",
        flags: []
      }
    ],
    verificationStatuses: {
      preTestForensics: 'passed',
      identityVerification: 'passed',
      biometricEnrollment: 'passed',
      documentVerification: 'passed'
    }
  },
  {
    id: "C002",
    name: "Michael Chen",
    email: "m.chen@globaltech.com",
    organization: "GlobalTech Solutions",
    location: "London, UK",
    testCenter: "London Bridge Center",
    status: "flagged",
    lastActivity: "2024-01-14T16:20:00Z",
    testsCompleted: 3,
    averageScore: 76.3,
    timeSpent: "2h 15m",
    suspiciousActivity: 2,
    phone: "+44-20-7946-0958",
    joinDate: "2024-01-05",
    department: "IT Security",
    position: "Security Analyst",
    testHistory: [
      {
        id: "T003",
        testName: "Cybersecurity Basics",
        date: "2024-01-14T15:00:00Z",
        score: 85,
        duration: "50m",
        status: "flagged",
        flags: ["Multiple tab switches", "Unusual typing pattern"]
      }
    ],
    verificationStatuses: {
      preTestForensics: 'failed',
      identityVerification: 'pending',
      biometricEnrollment: 'failed',
      documentVerification: 'pending'
    }
  },
  {
    id: "C003",
    name: "Emily Rodriguez",
    email: "emily.r@innovateplus.com",
    organization: "InnovatePlus Ltd",
    location: "Toronto, Canada",
    testCenter: "Toronto Innovation Hub",
    status: "completed",
    lastActivity: "2024-01-13T11:45:00Z",
    testsCompleted: 8,
    averageScore: 94.2,
    timeSpent: "6h 20m",
    suspiciousActivity: 0,
    phone: "+1-416-555-0987",
    joinDate: "2023-11-15",
    department: "Product Management",
    position: "Senior Product Manager",
    testHistory: [
      {
        id: "T004",
        testName: "Product Strategy",
        date: "2024-01-13T10:00:00Z",
        score: 96,
        duration: "75m",
        status: "completed",
        flags: []
      }
    ],
    verificationStatuses: {
      preTestForensics: 'passed',
      identityVerification: 'passed',
      biometricEnrollment: 'passed',
      documentVerification: 'passed'
    }
  },
  {
    id: "C004",
    name: "James Wilson",
    email: "j.wilson@techcorp.com",
    organization: "TechCorp Industries",
    location: "San Francisco, USA",
    testCenter: "Silicon Valley Center",
    status: "active",
    lastActivity: "2024-01-15T14:30:00Z",
    testsCompleted: 6,
    averageScore: 82.1,
    timeSpent: "4h 30m",
    suspiciousActivity: 1,
    phone: "+1-415-555-0456",
    joinDate: "2023-10-20",
    department: "Data Science",
    position: "Data Scientist",
    testHistory: [
      {
        id: "T005",
        testName: "Python for Data Science",
        date: "2024-01-15T13:00:00Z",
        score: 89,
        duration: "90m",
        status: "completed",
        flags: ["Extended break time"]
      }
    ],
    verificationStatuses: {
      preTestForensics: 'passed',
      identityVerification: 'pending',
      biometricEnrollment: 'passed',
      documentVerification: 'not-started'
    }
  },
  {
    id: "C005",
    name: "Anna Kowalski",
    email: "a.kowalski@eurotech.com",
    organization: "EuroTech Systems",
    location: "Berlin, Germany",
    testCenter: "Berlin Tech Center",
    status: "suspended",
    lastActivity: "2024-01-12T09:15:00Z",
    testsCompleted: 2,
    averageScore: 65.5,
    timeSpent: "1h 45m",
    suspiciousActivity: 5,
    phone: "+49-30-12345678",
    joinDate: "2024-01-08",
    department: "QA Testing",
    position: "QA Engineer",
    testHistory: [
      {
        id: "T006",
        testName: "Software Testing Fundamentals",
        date: "2024-01-12T08:00:00Z",
        score: 72,
        duration: "60m",
        status: "flagged",
        flags: ["Multiple suspicious activities", "Possible external assistance"]
      }
    ],
    verificationStatuses: {
      preTestForensics: 'failed',
      identityVerification: 'failed',
      biometricEnrollment: 'not-started',
      documentVerification: 'failed'
    }
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: "ORG001",
    name: "TechCorp Industries",
    industry: "Technology",
    candidateCount: 2,
    testsActive: 12,
    averageScore: 84.8,
    flaggedCandidates: 0
  },
  {
    id: "ORG002",
    name: "GlobalTech Solutions",
    industry: "IT Services",
    candidateCount: 1,
    testsActive: 5,
    averageScore: 76.3,
    flaggedCandidates: 1
  },
  {
    id: "ORG003",
    name: "InnovatePlus Ltd",
    industry: "Software Development",
    candidateCount: 1,
    testsActive: 3,
    averageScore: 94.2,
    flaggedCandidates: 0
  },
  {
    id: "ORG004",
    name: "EuroTech Systems",
    industry: "Technology Consulting",
    candidateCount: 1,
    testsActive: 2,
    averageScore: 65.5,
    flaggedCandidates: 1
  }
];

export const mockLocations: Location[] = [
  {
    id: "LOC001",
    city: "New York",
    country: "USA",
    candidateCount: 1,
    testCenters: 3,
    averageScore: 87.5
  },
  {
    id: "LOC002",
    city: "London",
    country: "UK",
    candidateCount: 1,
    testCenters: 2,
    averageScore: 76.3
  },
  {
    id: "LOC003",
    city: "Toronto",
    country: "Canada",
    candidateCount: 1,
    testCenters: 1,
    averageScore: 94.2
  },
  {
    id: "LOC004",
    city: "San Francisco",
    country: "USA",
    candidateCount: 1,
    testCenters: 4,
    averageScore: 82.1
  },
  {
    id: "LOC005",
    city: "Berlin",
    country: "Germany",
    candidateCount: 1,
    testCenters: 2,
    averageScore: 65.5
  }
];

export const mockTestCenters: TestCenter[] = [
  {
    id: "TC001",
    name: "Manhattan Testing Center",
    location: "New York, USA",
    capacity: 50,
    activeTests: 8,
    candidateCount: 1,
    equipment: ["HD Cameras", "Screen Recording", "Audio Monitoring"],
    supervisor: "Dr. Rachel Green"
  },
  {
    id: "TC002",
    name: "London Bridge Center",
    location: "London, UK",
    capacity: 30,
    activeTests: 5,
    candidateCount: 1,
    equipment: ["HD Cameras", "Biometric Scanners", "AI Proctoring"],
    supervisor: "Prof. David Smith"
  },
  {
    id: "TC003",
    name: "Toronto Innovation Hub",
    location: "Toronto, Canada",
    capacity: 25,
    activeTests: 3,
    candidateCount: 1,
    equipment: ["4K Cameras", "Advanced AI", "Secure Browsers"],
    supervisor: "Dr. Lisa Chen"
  },
  {
    id: "TC004",
    name: "Silicon Valley Center",
    location: "San Francisco, USA",
    capacity: 75,
    activeTests: 12,
    candidateCount: 1,
    equipment: ["Ultra HD Cameras", "Eye Tracking", "Facial Recognition"],
    supervisor: "Dr. Mark Johnson"
  },
  {
    id: "TC005",
    name: "Berlin Tech Center",
    location: "Berlin, Germany",
    capacity: 40,
    activeTests: 2,
    candidateCount: 1,
    equipment: ["HD Cameras", "Voice Analysis", "Keystroke Detection"],
    supervisor: "Dr. Klaus Mueller"
  }
];