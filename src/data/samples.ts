import { CandidateProfile, JobDescription } from '../types';

export const SAMPLE_CANDIDATE_PROFILE: CandidateProfile = {
  contact: {
    fullName: "Alex Rivera",
    email: "alex.rivera@example.com",
    phone: "+1 (555) 234-5678",
    location: "Austin, TX",
    linkedin: "linkedin.com/in/alex-rivera-tech",
    github: "github.com/alexrivera-dev",
    portfolio: "alexrivera.dev",
  },
  professionalSummary:
    "Senior Full-Stack Software Engineer with 6+ years of experience building high-throughput web applications, RESTful APIs, and microservice architectures. Proven track record in optimizing application performance, leading cross-functional engineering teams, and driving cloud migration projects.",
  workExperience: [
    {
      id: "work-1",
      company: "Apex Tech Solutions",
      role: "Senior Software Engineer",
      location: "Austin, TX",
      startDate: "Jan 2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected distributed React and Node.js microservices serving 1.5M daily active users.",
        "Improved API query performance by optimizing PostgreSQL indexes and implementing Redis caching.",
        "Led team of 5 engineers in migrating legacy monolith to Docker containers on AWS ECS.",
        "Mentored junior developers and instituted automated CI/CD unit and integration test pipelines."
      ],
    },
    {
      id: "work-2",
      company: "CloudScale Systems",
      role: "Full Stack Engineer",
      location: "Dallas, TX",
      startDate: "Jun 2019",
      endDate: "Dec 2021",
      current: false,
      bullets: [
        "Developed web applications using React, TypeScript, Express, and MongoDB.",
        "Integrated payment processing APIs and authentication middleware.",
        "Collaborated with product managers and UI designers to deliver new SaaS features."
      ],
    },
    {
      id: "work-3",
      company: "DataDrive Labs",
      role: "Junior Web Developer",
      location: "Austin, TX",
      startDate: "Jul 2018",
      endDate: "May 2019",
      current: false,
      bullets: [
        "Built responsive web interfaces with HTML5, CSS3, JavaScript, and React.",
        "Assisted in backend REST API endpoint creation and bug fixing."
      ],
    },
  ],
  skills: [
    {
      category: "Programming Languages",
      skills: ["TypeScript", "JavaScript", "Python", "SQL", "HTML5/CSS3"],
    },
    {
      category: "Frameworks & Libraries",
      skills: ["React", "Node.js", "Express.js", "Next.js", "Tailwind CSS", "GraphQL"],
    },
    {
      category: "Databases & Cloud",
      skills: ["PostgreSQL", "MongoDB", "Redis", "AWS (S3, ECS, Lambda)", "Docker", "Git"],
    },
    {
      category: "Methodologies",
      skills: ["Agile/Scrum", "CI/CD Pipelines", "System Architecture", "Unit Testing"],
    },
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of Texas at Austin",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationYear: "2018",
      location: "Austin, TX",
      gpa: "3.8/4.0",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "PulseMetrics Analytics Engine",
      description: "Real-time web traffic analytics dashboard built with Node.js and WebSockets.",
      technologies: ["React", "Node.js", "TypeScript", "Redis", "Tailwind"],
      link: "github.com/alexrivera-dev/pulse-metrics",
      bullets: [
        "Processed 50,000+ real-time telemetry events per minute with sub-50ms latency.",
        "Designed interactive charts using Recharts for live visitor visualization."
      ],
    },
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023",
    },
  ],
};

export const SAMPLE_5_JOB_DESCRIPTIONS: JobDescription[] = [
  {
    id: "jd-1",
    title: "Senior Full Stack Engineer",
    company: "Stripe Tech Solutions",
    content: `Role Overview:
We are seeking a Senior Full Stack Engineer with strong expertise in TypeScript, React, Node.js, and Distributed Systems.

Key Responsibilities:
- Build scalability-focused microservices handling high transaction volumes.
- Optimize REST and GraphQL APIs for latency and high availability.
- Work with cloud infrastructure including AWS (ECS, S3, RDS), Docker, and Kubernetes.
- Drive unit testing, integration testing, and CI/CD pipelines using GitHub Actions.
- Collaborate closely with product, UX, and security teams in an Agile Scrum environment.

Requirements:
- 5+ years experience in Full Stack development with React, Node.js, and TypeScript.
- Deep understanding of SQL databases (PostgreSQL) and caching layers (Redis).
- Proven experience in performance tuning, load monitoring, and system architecture.
- Excellent communication, mentoring skills, and cross-functional leadership.`,
  },
  {
    id: "jd-2",
    title: "Lead Web Application Developer",
    company: "DataFlow Systems",
    content: `About the Role:
DataFlow is hiring a Lead Web Application Developer to lead our core platform modernization team.

Responsibilities:
- Spearhead the rewrite of legacy frontends into modern React and Next.js SPAs.
- Architect scalable backend microservices using Node.js, Express, and GraphQL.
- Containerize application workloads with Docker and manage AWS cloud deployments.
- Implement automated testing frameworks (Jest, Playwright) and continuous integration.
- Standardize code review practices and mentor junior software engineers.

Technical Qualifications:
- Proficiency in TypeScript, React, Next.js, Node.js, PostgreSQL, and Redis.
- Solid background in cloud platforms (AWS Lambda, ECS, CloudWatch).
- Strong track record in API design, microservice security, and web performance optimization.
- Familiarity with Agile development processes and sprint planning.`,
  },
  {
    id: "jd-3",
    title: "Senior Backend & Platform Engineer",
    company: "CloudScale Innovations",
    content: `Position Summary:
Join our platform infrastructure team to build next-generation cloud services and data pipelines.

Primary Tasks:
- Design, deploy, and maintain high-throughput backend APIs using Node.js, TypeScript, and Python.
- Manage database scalability across PostgreSQL and Redis caching layers.
- Implement CI/CD pipelines and infrastructure-as-code using Terraform and AWS.
- Conduct root-cause analysis for system latency bottlenecks and downtime incidents.
- Drive code quality through automated unit testing, integration testing, and peer reviews.

Required Skills:
- 4+ years software engineering experience focused on Node.js, Python, and SQL.
- Strong knowledge of AWS, Docker containers, Kubernetes, and serverless architectures.
- Experience with GraphQL, WebSockets, and event-driven architectures.
- Bachelor's degree in Computer Science, Software Engineering, or equivalent experience.`,
  },
  {
    id: "jd-4",
    title: "Staff Software Engineer - SaaS Platform",
    company: "NexGen Enterprise",
    content: `Summary:
NexGen Enterprise is seeking a Staff Software Engineer to lead technical design and architecture across multi-tenant SaaS products.

Responsibilities:
- Define technical roadmaps and architectural standards for web applications and backend microservices.
- Ensure 99.99% service uptime through proactive monitoring, load balancing, and automated failover.
- Champion modern engineering standards including CI/CD, unit testing, and Docker containerization.
- Partner with security team to enforce SOC2 compliance, OAuth2 authentication, and data encryption.

Qualifications:
- Expert proficiency in React, TypeScript, Node.js, and PostgreSQL database optimization.
- Deep hands-on experience with AWS, Docker, Kubernetes, and distributed caching (Redis).
- Proven ability to mentor engineers, perform complex technical reviews, and articulate architecture decisions.`,
  },
  {
    id: "jd-5",
    title: "Principal Full Stack Developer",
    company: "Vanguard Tech Labs",
    content: `Description:
Vanguard Tech Labs is looking for a Principal Full Stack Developer to build mission-critical enterprise applications.

What You'll Do:
- Develop scalable front-end interfaces with React, Next.js, and Tailwind CSS.
- Build secure, scalable backend services with Express.js, TypeScript, and Node.js.
- Optimize SQL queries and data storage in PostgreSQL and MongoDB databases.
- Automate cloud infrastructure setup on AWS using Terraform and Docker pipelines.
- Lead sprint planning, architectural design reviews, and engineering mentorship.

Desired Experience:
- 6+ years in full stack web development (React/Node.js ecosystem).
- Expertise in AWS cloud infrastructure, microservices, GraphQL, and Redis.
- Strong commitment to clean code, test-driven development (TDD), and Agile methodologies.`,
  },
];

export const SAMPLE_SINGLE_TARGET_JD = {
  title: "Senior Full Stack Engineer - FinTech Platform",
  company: "Apex Global Financial",
  content: `Apex Global Financial is seeking a Senior Full Stack Engineer to build next-generation payment routing microservices and real-time dashboard platforms.

Key Responsibilities:
- Architect high-throughput, low-latency microservices with Node.js, TypeScript, and GraphQL.
- Build responsive customer dashboards in React, Next.js, and Tailwind CSS.
- Optimize complex PostgreSQL financial database queries and Redis caching strategy.
- Implement automated CI/CD workflows using AWS ECS, Docker, and GitHub Actions.
- Ensure strict PCI-DSS security standards, OAuth2 authentication, and system reliability.
- Conduct code reviews, establish testing benchmarks, and mentor junior developers.

Key Requirements:
- 5+ years of full stack web development experience (TypeScript, Node.js, React).
- Proven track record optimizing API response latency and database throughput under heavy load.
- AWS certification or cloud deployment expertise (ECS, S3, Lambda, Docker).
- Strong experience with automated testing, CI/CD pipelines, and microservices architecture.`
};
