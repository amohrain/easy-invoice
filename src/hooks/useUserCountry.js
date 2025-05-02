// hooks/useUserCountry.js
import { useEffect, useState } from "react";

export default function useUserCountry() {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => setCountry("US")); // fallback
  }, []);

  return country;
}
