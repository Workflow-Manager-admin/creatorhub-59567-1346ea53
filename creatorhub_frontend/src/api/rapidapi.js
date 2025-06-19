//
// PUBLIC_INTERFACE
// API stub for RapidAPI integrations; returns a mock payload asynchronously with latency.
/**
 * Returns mock RapidAPI integration data with simulated network delay.
 */
export async function fetchRapidAPIContent(/*query*/) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "rapid01",
          title: "Weather API",
          description: "Global weather data for any city.",
          url: "https://rapidapi.com/weatherapi",
          category: "Data",
        },
        {
          id: "rapid02",
          title: "Currency Converter",
          description: "Convert between 150+ currencies.",
          url: "https://rapidapi.com/currencyapi",
          category: "Finance",
        },
      ]);
    }, 950 + Math.random() * 650); // 0.95-1.6s
  });
}
