import { CarProps, FilterProps } from "@/types";

// Calculate Car Rent
export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50;
  const mileageFactor = 0.1;
  const ageFactor = 0.05;

  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};

// Update Search Params (Client-Side)
export const updateSearchParams = (type: string, value: string) => {
  if (typeof window === "undefined") return ""; // SSR Safety

  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set(type, value);

  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};

// Delete Search Params (Client-Side)
export const deleteSearchParams = (type: string) => {
  if (typeof window === "undefined") return ""; // SSR Safety

  const newSearchParams = new URLSearchParams(window.location.search);
  newSearchParams.delete(type.toLowerCase());

  const newPathname = `${window.location.pathname}?${newSearchParams.toString()}`;
  return newPathname;
};

// Fetch Cars with Safe Defaults and Error Handling
export const fetchCars = async (filters: FilterProps) => {
  const {
    manufacturer = "",
    year = 2022,
    model = "",
    limit = 10,
    fuel = "",
  } = filters;

  const headers: HeadersInit = {
    "X-RapidAPI-Key": process.env.NEXT_PUBLIC_RAPID_API_KEY || "",
    "X-RapidAPI-Host": "cars-by-api-ninjas.p.rapidapi.com",
  };

  try {
    const url = `https://cars-by-api-ninjas.p.rapidapi.com/v1/cars?make=${manufacturer}&year=${year}&model=${model}&limit=${limit}&fuel_type=${fuel}`;

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.error("Failed to fetch cars:", response.statusText);
      return [];
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("FetchCars Error:", error);
    return [];
  }
};

// Generate Car Image URL
export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");
  const { make, model, year } = car;

  url.searchParams.append("customer", process.env.NEXT_PUBLIC_IMAGIN_API_KEY || "");
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  if (angle) url.searchParams.append("angle", angle);

  return url.toString();
};
