export const siteConfig = {
  name: "Sohail Writes",
  description: "Backend, databases & system design blogs",
  url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  author: {
    name: "Sohail Ansari",
    twitter: "@sohail",
  },
  links: {
    github: "https://github.com/sohail300",
    linkedin: "https://www.linkedin.com/in/md-sohail-ansari-b51201278/",
  },
  keywords: [
    "backend engineering",
    "databases",
    "system design",
    "software engineering",
    "nodejs",
    "mongodb",
    "api design",
    "scalability",
    "performance",
    "architecture",
  ],
};

export type SiteConfig = typeof siteConfig;

