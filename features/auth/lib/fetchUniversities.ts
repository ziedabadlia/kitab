import { UniversityOption } from "../types/university";

export const fetchUniversities = async (): Promise<UniversityOption[]> => {
  // Replace this placeholder with an actual API call (e.g., using axios or fetch)
  // For example: const response = await fetch('YOUR_UNIVERSITY_API_ENDPOINT');
  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
  return [
    { id: "u1", name: "University of Science and Technology (UST)" },
    { id: "u2", name: "Algiers University 1" },
    { id: "u3", name: "Constantine 2 University" },
    { id: "u4", name: "Oran 1 University" },
    // Add more universities here...
  ];
};
