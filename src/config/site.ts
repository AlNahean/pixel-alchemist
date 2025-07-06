export const siteConfig = {
  name: "Pixel Alchemist",
  url: "https://pixel-alchemist.vercel.app", // Change this to your actual deployed URL
  ogImage: "https://pixel-alchemist.vercel.app/opengraph-image.jpg", // Change this to your actual deployed URL
  description:
    "An open-source tool to transform your images into interactive 3D art using AI-powered depth maps and mesmerizing WebGL shaders. Upload a photo and see the magic.",
  links: {
    twitter: "https://x.com/alnahean", // Your twitter handle
    github: "https://github.com/alnahean/pixel-alchemist-2", // Your project's GitHub repo
  },
  author: {
    name: "Al Nahean", // Your name
    url: "https://nahean.com", // Your website
  },
  creator: {
    name: "nahean", // Your username or name
  },
};

export type SiteConfig = typeof siteConfig;

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export const navLinks = [
  {
    label: "Docs",
    href: "/docs",
    isActive: (pathname: string) => pathname === "/docs",
    external: false,
  },
  {
    label: "Blog",
    href: "/blog",
    isActive: (pathname: string) => pathname === "/blog",
    external: false,
  },
  {
    label: "Projects",
    href: "/projects",
    isActive: (pathname: string) => pathname === "/projects",
    external: false,
  },
  {
    label: "Changelog",
    href: "/changelog",
    isActive: (pathname: string) => pathname === "/changelog",
    external: false,
  },
  {
    label: "About",
    href: "/about",
    isActive: (pathname: string) => pathname === "/about",
    external: false,
  },
];
export type Project = {
  title: string;
  description: string;
  href: string;
  github?: string;
  image: string;
  tags: string[];
  featured?: boolean;
};
