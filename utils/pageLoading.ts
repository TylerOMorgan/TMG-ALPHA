export const pageLoaders = {
  home: () => import("../components/pages/Home"),
  about: () => import("../components/pages/About"),
  artists: () => import("../components/pages/Artists"),
  contact: () => import("../components/pages/Contact"),
};

// Warm only the destination the visitor points to or focuses with the keyboard.
export const preloadPage = (page: string) => {
  const key = page === "about2" || page === "about3" ? "about" : page;
  if (Object.prototype.hasOwnProperty.call(pageLoaders, key)) {
    void pageLoaders[key as keyof typeof pageLoaders]().catch(() => {});
  }
};
