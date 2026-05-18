import attachWeatherToActivity from "../src/httpLogic.js";

class MockActivity {
  constructor(hour) {
    this.hour = hour;
  }
  getHour() {
    return this.hour;
  }
}

describe("Unit Test - httpLogic Mapper", () => {
  it("should return the activity unaltered if the activity or weather blocks are null", () => {
    const activity = new MockActivity("14:00");
    const resultNull = attachWeatherToActivity(null, null);
    const resultNoSquares = attachWeatherToActivity(activity, { squares: null });

    expect(resultNull).toBeNull();
    expect(resultNoSquares).toBe(activity);
    expect(activity.getWeather).toBeUndefined();
  });

  it("should attach the weather block closest to the activity time", () => {
    const activity = new MockActivity("13:15"); 
    
    const todayWeatherData = {
      squares: [
        { dt_txt: "2026-05-18 09:00:00", main: { temp: 20 }, weather: [{ main: "Clouds", description: "cloudy", icon: "03d" }] }, 
        { dt_txt: "2026-05-18 12:00:00", main: { temp: 26 }, weather: [{ main: "Clear", description: "clear sky", icon: "01d" }] },  
        { dt_txt: "2026-05-18 15:00:00", main: { temp: 24 }, weather: [{ main: "Rain", description: "light rain", icon: "10d" }] }   
      ]
    };

    const updatedActivity = attachWeatherToActivity(activity, todayWeatherData);

    expect(updatedActivity.getWeather).toBeDefined();
    
    const weatherData = updatedActivity.getWeather();
    expect(weatherData.temperature).toBe(26);
    expect(weatherData.condition).toBe("Clear");
    expect(weatherData.hour).toBe("12:00");
  });

  it("should not inject weather data if the time difference exceeds 180 minutes", () => {
    const activity = new MockActivity("23:30"); 
    const todayWeatherData = {
      squares: [
        { dt_txt: "2026-05-18 06:00:00", main: { temp: 17 }, weather: [{ main: "Clear", description: "clear", icon: "01d" }] }
      ]
    };

    const updatedActivity = attachWeatherToActivity(activity, todayWeatherData);
    expect(updatedActivity.getWeather).toBeUndefined();
  });
});