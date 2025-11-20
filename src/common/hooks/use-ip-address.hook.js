import axios from "axios";
import { useEffect, useState } from "react";

function useIPAddress() {
  const [ipResponse, setIpResponse] = useState("");
  useEffect(() => {
    // Using ip-api.com which supports CORS (free tier: 45 requests/minute)
    // ip-api.com returns different field names, so we normalize them to match ipapi.co format
    axios
      .get(
        "https://ip-api.com/json/?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone,isp,query"
      )
      .then((res) => {
        const { data } = res;
        if (data.status === "success") {
          // Normalize response to match expected format (ipapi.co format)
          const normalizedData = {
            country: data.country,
            country_code: data.countryCode,
            region: data.region,
            region_name: data.regionName,
            city: data.city,
            latitude: data.lat,
            longitude: data.lon,
            timezone: data.timezone,
            isp: data.isp,
            ip: data.query,
          };
          setIpResponse(normalizedData);
        }
      })
      .catch((err) => {
        // Silent failover
      });
  }, []);

  return { ipResponse };
}

export default useIPAddress;
