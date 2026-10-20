export const site = {
  name: "Asiful Hasan Khan",
  shortName: "Asif Khan",
  role: "Fullstack developer and UI/UX designer",
  location: "Sylhet, Bangladesh",
  email: "asiffkhanx007@gmail.com",
  phone: { display: "+880 1707-613617", href: "tel:+8801707613617" },
  whatsapp: "https://wa.me/8801707613617",
  cv: { href: "/cv/Asiful_Hasan_Khan_CV.pdf", label: "Download CV", size: "PDF, 53 KB" },
};

export const socials = [
  { label: "GitHub", handle: "Asiff-k", href: "https://github.com/Asiff-k" },
  {
    label: "LinkedIn",
    handle: "asif-khan-0b4a00312",
    href: "https://www.linkedin.com/in/asif-khan-0b4a00312",
  },
  { label: "Instagram", handle: "__asiff__k", href: "https://www.instagram.com/__asiff__k/" },
  { label: "Facebook", handle: "asifff.k", href: "https://www.facebook.com/asifff.k/" },
] as const;

// Contact tiles. Every link and detail here was confirmed by Asif.
export const contacts = [
  { label: "Email", value: site.email, href: `mailto:${site.email}`, logo: "gmail" },
  // One number for calls and WhatsApp: one row with a link for each.
  {
    label: "Phone and WhatsApp",
    value: site.phone.display,
    href: site.phone.href,
    icon: "phone",
    also: { label: "WhatsApp", href: site.whatsapp, logo: "whatsapp" },
  },
  { label: "GitHub", value: "Asiff-k", href: socials[0].href, logo: "github", external: true },
  { label: "LinkedIn", value: "asif-khan-0b4a00312", href: socials[1].href, logo: "linkedin", external: true },
  { label: "Instagram", value: "__asiff__k", href: socials[2].href, logo: "instagram", external: true },
  { label: "Facebook", value: "asifff.k", href: socials[3].href, logo: "facebook", external: true },
  { label: "CV", value: `Download (${site.cv.size})`, href: site.cv.href, icon: "cv", download: true },
] as const;

export const nav = [
  { label: "Work", href: "/#work" },
  { label: "Design", href: "/#design" },
  { label: "AI data", href: "/#ai-data" },
  { label: "Experience", href: "/#experience" },
  { label: "AI tools", href: "/ai-tools" },
] as const;
