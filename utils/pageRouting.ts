export type Page = "home" | "about" | "artists" | "contact" | "not-found";

export const getPageFromLocation = ({ pathname, hash }: { pathname: string; hash: string }): Page => {
  if (pathname !== "/" && pathname !== "/index.html") return "not-found";
  const route = hash.toLowerCase().replace(/^#\/?/, "");
  if (["", "home"].includes(route)) return "home";
  if (route === "about") return "about";
  if (["artists", "artist", "roster"].includes(route)) return "artists";
  if ([
    "demo-submission", "demo-submissions", "demo", "demos",
    "general-inquiry", "general-enquiry", "inquiry", "enquiry", "general",
    "contact", "contact-form", "email-ticker",
  ].includes(route)) return "contact";
  return "not-found";
};

export const getPageUrl = (page: string): string => {
  if (page === "home") return "/";
  if (page === "contact") return "/#general-inquiry";
  return `/#${page}`;
};
