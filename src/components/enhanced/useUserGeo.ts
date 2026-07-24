import { useState, useEffect, useRef } from "react";

export interface UserGeoInfo {
  lat: number;
  lng: number;
  city: string;
  country: string;
  region: string;
  ip: string;
  isp: string;
}

const defaultGeo: UserGeoInfo = {
  lat: 35.8617,
  lng: 104.1954,
  city: "",
  country: "",
  region: "",
  ip: "",
  isp: "",
};

let cachedGeo: UserGeoInfo | null = null;
let fetchPromise: Promise<UserGeoInfo> | null = null;

const strategies = [
  {
    // 優先使用 IPv4 專用端點，盡量顯示 IPv4 位址
    url: "https://api-ipv4.ip.sb/geoip",
    check: (j: any) => "country" in j,
    map: (j: any) => ({
      country: j.country || "",
      region: j.region || "",
      city: j.city || "",
      isp: j.asn_organization || "",
      ip: j.ip || "",
      lat: j.latitude,
      lng: j.longitude,
    }),
  },
  {
    url: "https://api.ip.sb/geoip",
    check: (j: any) => "country" in j,
    map: (j: any) => ({
      country: j.country || "",
      region: j.region || "",
      city: j.city || "",
      isp: j.asn_organization || "",
      ip: j.ip || "",
      lat: j.latitude,
      lng: j.longitude,
    }),
  },
  {
    url: "https://ipwho.is",
    check: (j: any) => j.success === true,
    map: (j: any) => ({
      country: j.country || "",
      region: j.region || "",
      city: j.city || "",
      isp: j.connection?.isp || "",
      ip: j.ip || "",
      lat: j.latitude,
      lng: j.longitude,
    }),
  },
  {
    url: "https://api.ipapi.is",
    check: (j: any) => "location" in j && "country" in j.location,
    map: (j: any) => ({
      country: j.location?.country || "",
      region: j.location?.state || "",
      city: j.location?.city || "",
      isp: j.company?.name || j.datacenter?.datacenter || j.abuse?.name || "",
      ip: j.ip || "",
      lat: j.location?.latitude,
      lng: j.location?.longitude,
    }),
  },
];

async function fetchGeoInfo(): Promise<UserGeoInfo> {
  if (cachedGeo) return cachedGeo;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const result = { ...defaultGeo };

    for (const strategy of strategies) {
      try {
        const response = await fetch(strategy.url, {
          signal: AbortSignal.timeout(5000),
        });
        if (response.ok) {
          const data = await response.json();
          if (strategy.check(data)) {
            const mapped = strategy.map(data);
            result.country = mapped.country || result.country;
            result.region = mapped.region || result.region;
            result.city = mapped.city || result.city;
            result.isp = mapped.isp || result.isp;
            if (mapped.lat && mapped.lng) {
              result.lat = parseFloat(mapped.lat);
              result.lng = parseFloat(mapped.lng);
            }
            if (mapped.ip) {
              result.ip = mapped.ip;
              break;
            }
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch from ${strategy.url}:`, e);
      }
    }

    cachedGeo = result;
    return result;
  })();

  return fetchPromise;
}

export function useUserGeo() {
  const [geo, setGeo] = useState<UserGeoInfo>(cachedGeo || defaultGeo);
  const [loading, setLoading] = useState(!cachedGeo);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    if (cachedGeo) {
      setGeo(cachedGeo);
      setLoading(false);
      return;
    }
    fetchGeoInfo().then((result) => {
      if (mounted.current) {
        setGeo(result);
        setLoading(false);
      }
    });
    return () => {
      mounted.current = false;
    };
  }, []);

  return { geo, loading };
}

export function getUserGeoCache(): UserGeoInfo {
  return cachedGeo || defaultGeo;
}

export { fetchGeoInfo };
