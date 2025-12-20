/**
 * Truncates a string to a specified length and appends an ellipsis.
 * * @param text - The string to be truncated
 * @param length - The maximum number of characters (default 30)
 * @param suffix - The string to append at the end (default '...')
 * @returns The truncated string
 */
export const truncateText = (
  text: string | undefined | null,
  length: number = 30,
  suffix: string = "..."
): string => {
  if (!text) return "";

  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length).trim() + suffix;
};
