import { UniversityOption } from "../types/university";

export const fetchUniversities = async (
  search: string = "",
): Promise<UniversityOption[]> => {
  const res = await fetch(
    `/api/universities?name=${encodeURIComponent(search)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch universities");

  const data = await res.json();
  return data;
};
