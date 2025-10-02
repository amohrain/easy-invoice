// hooks/useUserCountry.js
import { useEffect, useState } from "react";

export default function useUserCountry() {
  const [country, setCountry] = useState("US");

  useEffect(() => {
    // Check localStorage first
    const storedCountry = localStorage.getItem("userCountry");
    if (storedCountry) {
      setCountry(storedCountry);
      return;
    }
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        setCountry(data.country);
        localStorage.setItem("userCountry", data.country);
      })
      .catch(() => setCountry("US")); // fallback
  }, []);

  return country;
}
