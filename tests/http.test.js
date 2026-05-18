/**
 * @jest-environment jsdom
 */
//

import getForeCast from "../src/http.js";

describe("Teste de Integração - Módulo HTTP (OpenWeather)", () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();

    global.fetch = jest.fn();

    consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("Deve carregar os dados diretamente do localStorage caso existam em cache", async () => {
    const locationData = ["Águas claras", "DF", "BR"];
    const fakeDate = new Date("2026-05-18T12:00:00Z");
    const cachedData = { city: "Águas claras", date: "2026-05-18", squares: [] };

    localStorage.setItem("weather_2026-05-18", JSON.stringify(cachedData));

    const result = await getForeCast(locationData, fakeDate);

    expect(result).toEqual(cachedData);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("Deve fazer requisições à API, salvar 5 dias no cache e remover caches anteriores expirados", async () => {
    const locationData = ["Águas claras", "DF", "BR"];
    const fakeDate = new Date("2026-05-18T12:00:00Z");

    localStorage.setItem("weather_2026-05-10", "dados_velhos");

    const geoResponse = [{ lat: -15.83, lon: -48.01, name: "Águas Claras", country: "BR" }];
    
    const forecastResponse = {
      city: { name: "Águas Claras" },
      list: [
        { dt_txt: "2026-05-18 12:00:00", main: { temp: 24 }, weather: [{ main: "Clear", description: "céu limpo", icon: "01d" }] },
        { dt_txt: "2026-05-19 15:00:00", main: { temp: 22 }, weather: [{ main: "Clouds", description: "nuvens", icon: "02d" }] },
        { dt_txt: "2026-05-20 18:00:00", main: { temp: 20 }, weather: [{ main: "Rain", description: "chuva", icon: "10d" }] },
        { dt_txt: "2026-05-21 09:00:00", main: { temp: 25 }, weather: [{ main: "Clear", description: "céu limpo", icon: "01d" }] },
        { dt_txt: "2026-05-22 06:00:00", main: { temp: 19 }, weather: [{ main: "Clouds", description: "nuvens", icon: "02d" }] }
      ]
    };

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => geoResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => forecastResponse,
      });

    const result = await getForeCast(locationData, fakeDate);

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(localStorage.getItem("weather_2026-05-10")).toBeNull();
    expect(localStorage.getItem("weather_2026-05-18")).toBeDefined(); 
    expect(localStorage.getItem("weather_2026-05-22")).toBeDefined();

    expect(result.city).toBe("Águas Claras");
    expect(result.squares[0].main.temp).toBe(24);
  });
});