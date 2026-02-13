export const NIGERIAN_CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Benin City",
  "Enugu",
  "Aba",
  "Jos",
  "Ilorin"
];

export const validateNigerianCity = (location: string): boolean => {
  return NIGERIAN_CITIES.some(city => 
    location.toLowerCase().includes(city.toLowerCase())
  );
};

export const getCityFromLocation = (location: string): string | null => {
  const matched = NIGERIAN_CITIES.find(city => 
    location.toLowerCase().includes(city.toLowerCase())
  );
  return matched || null;
};
