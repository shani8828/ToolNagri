const fs = require("fs");
const path = require("path");

const toolsFilePath = path.join(__dirname, "tools.ts");
const appDir = path.join(__dirname, "..", "app");

// 1. Read tools.ts
const content = fs.readFileSync(toolsFilePath, "utf8");

// Parse objects using a simple state machine/regex
// We want to extract name, url, description for each tool item
const toolBlockRegex = /\{([^}]+)\}/g;
let match;
const tools = [];

while ((match = toolBlockRegex.exec(content)) !== null) {
  const block = match[1];
  
  const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
  const urlMatch = block.match(/url:\s*["']\/([^"']+)["']/);
  const descMatch = block.match(/description:\s*["']([^"']+)["']/);
  
  if (nameMatch && urlMatch && descMatch) {
    tools.push({
      name: nameMatch[1].trim(),
      folder: urlMatch[1].trim(),
      description: descMatch[1].trim(),
    });
  }
}

console.log(`Parsed ${tools.length} tools from tools.ts.`);

// Helper to write a layout.tsx file
function writeLayout(folder, title, description) {
  const folderPath = path.join(appDir, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const layoutPath = path.join(folderPath, "layout.tsx");
  const layoutContent = `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${title.replace(/"/g, '\\"')}",
  description: "${description.replace(/"/g, '\\"')}",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

  fs.writeFileSync(layoutPath, layoutContent, "utf8");
}

// 2. Generate layouts for all tools
tools.forEach(tool => {
  // Craft optimized titles and descriptions
  // Example title: "What is my IP Address | ToolNagri"
  // Example desc: "Quickly lookup your public IP address, geo-location coordinates, ISP, and connection properties. Safe, secure and 100% client-side."
  const title = `${tool.name} | ToolNagri`;
  const description = `${tool.description} Fully client-side and secure.`;
  writeLayout(tool.folder, title, description);
});

// 3. Generate layouts for static pages
const staticPages = [
  {
    folder: "all-tools",
    title: "All Online Utilities Directory | ToolNagri",
    description: "Browse our complete catalog of calculators, converters, formatting systems, code validators, and campaign builders, all built to run securely on the client-side."
  },
  {
    folder: "contact",
    title: "Contact Us | ToolNagri",
    description: "Get in touch with the ToolNagri support team. Send your suggestions, feedback, or report technical bugs."
  },
  {
    folder: "privacy",
    title: "Privacy Policy | ToolNagri",
    description: "Read the Privacy Policy of ToolNagri to understand how we protect and process your local browser session data."
  },
  {
    folder: "terms",
    title: "Terms of Service | ToolNagri",
    description: "Read the Terms and Conditions of ToolNagri. Learn about user agreements and client-side tool rules."
  },
  {
    folder: "disclaimer",
    title: "Disclaimer | ToolNagri",
    description: "View the official disclaimer for ToolNagri. Read about client-side processing, accuracy of calculations, and link safety."
  }
];

staticPages.forEach(page => {
  writeLayout(page.folder, page.title, page.description);
});

console.log("Successfully generated all layout.tsx metadata wrappers!");
