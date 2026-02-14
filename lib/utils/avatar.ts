// Helper to get initials
const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length >= 2)
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
};

// Helper for consistent "random" colors based on the user's name
const getAvatarColor = (name: string) => {
  const colors = [
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-cyan-500",
    "bg-orange-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export { getInitials, getAvatarColor };
