import { Country, State } from 'country-state-city';

// Cache key constants
const COUNTRIES_CACHE_KEY = 'cached_countries';
const STATES_CACHE_KEY = 'cached_states';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

interface CachedData {
  timestamp: number;
  data: any;
}

// Function to get data from cache
const getFromCache = (key: string) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  const parsedCache: CachedData = JSON.parse(cached);
  const now = new Date().getTime();

  // Check if cache is expired
  if (now - parsedCache.timestamp > CACHE_DURATION) {
    localStorage.removeItem(key);
    return null;
  }

  return parsedCache.data;
};

// Function to set data in cache
const setInCache = (key: string, data: any) => {
  const cacheData: CachedData = {
    timestamp: new Date().getTime(),
    data,
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

// Get all countries
export const getCountries = () => {
  const cachedCountries = getFromCache(COUNTRIES_CACHE_KEY);
  if (cachedCountries) {
    console.log('Using cached countries data');
    return cachedCountries;
  }

  const countries = Country.getAllCountries().map(country => ({
    name: country.name,
    isoCode: country.isoCode,
  }));
  
  setInCache(COUNTRIES_CACHE_KEY, countries);
  return countries;
};

// Get states for a country
export const getStates = (countryCode: string) => {
  const cacheKey = `${STATES_CACHE_KEY}_${countryCode}`;
  const cachedStates = getFromCache(cacheKey);
  
  if (cachedStates) {
    console.log(`Using cached states data for ${countryCode}`);
    return cachedStates;
  }

  const states = State.getStatesOfCountry(countryCode).map(state => ({
    name: state.name,
    isoCode: state.isoCode,
  }));

  setInCache(cacheKey, states);
  return states;
};