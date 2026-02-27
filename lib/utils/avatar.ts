// Helper to get initials
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2)
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// Pastel background + dark matching text pairs — matches the design in the screenshot
// Each entry is [bgClass, textClass]
// Each entry: [bg, text, border] — border is one step darker than bg
const AVATAR_COLORS: [string, string, string][] = [
  ["bg-violet-200", "text-violet-800", "border-violet-300"],
  ["bg-yellow-200", "text-yellow-800", "border-yellow-300"],
  ["bg-emerald-200", "text-emerald-800", "border-emerald-300"],
  ["bg-blue-200", "text-blue-800", "border-blue-300"],
  ["bg-rose-200", "text-rose-800", "border-rose-300"],
  ["bg-orange-200", "text-orange-800", "border-orange-300"],
  ["bg-cyan-200", "text-cyan-800", "border-cyan-300"],
  ["bg-pink-200", "text-pink-800", "border-pink-300"],
  ["bg-lime-200", "text-lime-800", "border-lime-300"],
  ["bg-indigo-200", "text-indigo-800", "border-indigo-300"],
];

// Returns { bg, text, border } Tailwind classes based on a hash of the name
// — same name always gets the same color triple
const getAvatarColor = (
  name: string,
): { bg: string; text: string; border: string } => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const [bg, text, border] =
    AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
  return { bg, text, border };
};

export { getInitials, getAvatarColor };
