/**
 * Database Seed Script
 * Run this to populate the database with sample blog data
 * 
 * Usage: node --loader ts-node/esm scripts/seed.ts
 * Or add to package.json: "seed": "tsx scripts/seed.ts"
 */

import connectDB from "../lib/db";
import Blog from "../lib/models/Blog";

const sampleBlogs = [
  {
    title: "Understanding Database Indexing in MongoDB",
    excerpt:
      "A comprehensive guide to database indexes, their types, and how they improve query performance in MongoDB applications.",
    platform: "Medium",
    url: "https://medium.com/@sohail/understanding-database-indexing",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d",
    publishedAt: new Date("2024-01-15"),
    tags: ["mongodb", "database", "performance", "indexing"],
    isPublished: true,
  },
  {
    title: "Building Scalable REST APIs with Node.js",
    excerpt:
      "Learn best practices for building production-ready REST APIs using Node.js, Express, and MongoDB.",
    platform: "Dev.to",
    url: "https://dev.to/sohail/building-scalable-rest-apis",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479",
    publishedAt: new Date("2024-02-20"),
    tags: ["nodejs", "api", "backend", "express"],
    isPublished: true,
  },
  {
    title: "Microservices Architecture: A Practical Guide",
    excerpt:
      "Dive into microservices architecture patterns, best practices, and common pitfalls to avoid when building distributed systems.",
    platform: "Hashnode",
    url: "https://hashnode.com/@sohail/microservices-guide",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31",
    publishedAt: new Date("2024-03-10"),
    tags: ["microservices", "architecture", "system-design", "backend"],
    isPublished: true,
  },
  {
    title: "Redis Caching Strategies for High-Performance Apps",
    excerpt:
      "Explore different caching strategies using Redis to optimize application performance and reduce database load.",
    platform: "Medium",
    url: "https://medium.com/@sohail/redis-caching-strategies",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71",
    publishedAt: new Date("2024-04-05"),
    tags: ["redis", "caching", "performance", "optimization"],
    isPublished: true,
  },
  {
    title: "GraphQL vs REST: When to Use Which",
    excerpt:
      "A detailed comparison of GraphQL and REST APIs, their pros and cons, and guidelines for choosing the right approach.",
    platform: "Dev.to",
    url: "https://dev.to/sohail/graphql-vs-rest",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    publishedAt: new Date("2024-05-12"),
    tags: ["graphql", "rest", "api", "backend"],
    isPublished: true,
  },
  {
    title: "PostgreSQL Performance Tuning Tips",
    excerpt:
      "Essential PostgreSQL performance tuning techniques for database administrators and backend developers.",
    platform: "Personal Blog",
    url: "https://sohailwrites.com/postgresql-performance-tuning",
    image: "https://images.unsplash.com/photo-1504639725590-34d0984388bd",
    publishedAt: new Date("2024-06-18"),
    tags: ["postgresql", "database", "performance", "sql"],
    isPublished: true,
  },
  {
    title: "Docker Best Practices for Backend Development",
    excerpt:
      "Learn Docker best practices for containerizing backend applications, from development to production deployment.",
    platform: "Medium",
    url: "https://medium.com/@sohail/docker-best-practices",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b",
    publishedAt: new Date("2024-07-22"),
    tags: ["docker", "devops", "containers", "backend"],
    isPublished: true,
  },
  {
    title: "Message Queues: RabbitMQ vs Kafka",
    excerpt:
      "Understanding the differences between RabbitMQ and Apache Kafka for building event-driven architectures.",
    platform: "Hashnode",
    url: "https://hashnode.com/@sohail/rabbitmq-vs-kafka",
    image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6",
    publishedAt: new Date("2024-08-30"),
    tags: ["rabbitmq", "kafka", "messaging", "architecture"],
    isPublished: true,
  },
  {
    title: "Implementing Authentication with JWT",
    excerpt:
      "Step-by-step guide to implementing secure authentication using JSON Web Tokens in Node.js applications.",
    platform: "Dev.to",
    url: "https://dev.to/sohail/jwt-authentication",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    publishedAt: new Date("2024-09-14"),
    tags: ["authentication", "jwt", "security", "nodejs"],
    isPublished: true,
  },
  {
    title: "Database Sharding Strategies Explained",
    excerpt:
      "Comprehensive overview of database sharding techniques for scaling applications to handle millions of users.",
    platform: "Medium",
    url: "https://medium.com/@sohail/database-sharding-strategies",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    publishedAt: new Date("2024-10-20"),
    tags: ["database", "sharding", "scaling", "architecture"],
    isPublished: true,
  },
  {
    title: "Building Real-Time Applications with WebSockets",
    excerpt:
      "Learn how to build real-time, bidirectional communication in web applications using WebSockets and Socket.io.",
    platform: "Personal Blog",
    url: "https://sohailwrites.com/websockets-tutorial",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64",
    publishedAt: new Date("2024-11-08"),
    tags: ["websockets", "real-time", "nodejs", "socketio"],
    isPublished: true,
  },
  {
    title: "API Rate Limiting Best Practices",
    excerpt:
      "Implementing effective rate limiting strategies to protect your APIs from abuse and ensure fair usage.",
    platform: "Dev.to",
    url: "https://dev.to/sohail/api-rate-limiting",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    publishedAt: new Date("2024-12-15"),
    tags: ["api", "rate-limiting", "security", "backend"],
    isPublished: true,
  },
  {
    title: "DRAFT: Advanced TypeScript Patterns",
    excerpt:
      "Exploring advanced TypeScript patterns and techniques for building type-safe backend applications.",
    platform: "Medium",
    url: "https://medium.com/@sohail/advanced-typescript-patterns",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    publishedAt: new Date("2025-01-01"),
    tags: ["typescript", "patterns", "backend", "nodejs"],
    isPublished: false, // Draft
  },
];

async function seed() {
  try {
    console.log("🌱 Starting database seed...");

    // Connect to database
    await connectDB();

    // Clear existing blogs (optional - comment out if you want to keep existing data)
    await Blog.deleteMany({});
    console.log("🗑️  Cleared existing blogs");

    // Insert sample blogs
    const blogs = await Blog.insertMany(sampleBlogs);
    console.log(`✅ Successfully seeded ${blogs.length} blogs`);

    // Display stats
    const stats = await Blog.aggregate([
      {
        $group: {
          _id: "$platform",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("\n📊 Blog Stats by Platform:");
    stats.forEach((stat) => {
      console.log(`   - ${stat._id}: ${stat.count} blogs`);
    });

    const published = await Blog.countDocuments({ isPublished: true });
    const drafts = await Blog.countDocuments({ isPublished: false });
    console.log(`\n📝 Published: ${published} | Drafts: ${drafts}`);

    console.log("\n✨ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seed();

