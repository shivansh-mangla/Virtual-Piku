const BASE_URL = "https://data-dump-3ce.pages.dev";

export const fetchData = async (url: string) => {
  const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
  const response = await fetch(fullUrl);

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
};
