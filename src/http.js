const key = 'd5df1ef348f794aa68b83c7c19b6fae4';

function getLatitudeAndLongitudeFromName(cityName, stateCode, countryCode) {
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)},${stateCode},${countryCode}&limit=1&appid=${key}`;
  
  return fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Http error: ${response.status}`);

      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        console.log('city not found');
        return;
      }

      const {lat, lon, name, country} = data[0];

      return {lat, lon, name, country};
    })
    .catch(error => {
      console.error(error.message);
      return;
    });
}

export default async function getForeCast(locationData, dateObj){
  const dateStr = formatDate(dateObj);

  const savedTodayWeather = localStorage.getItem(`weather_${dateStr}`);

  if (savedTodayWeather) {
    console.log('=== loading data from local storage ===')
    const todayWeatherData = JSON.parse(savedTodayWeather);
    console.log(todayWeatherData);
    return todayWeatherData;
  }

  console.log('=== making new request to OpenWeatherAPI ===')

  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('weather_')) {
      const dateKey = key.split('_')[1];
      if (dateKey < dateStr) { 
        localStorage.removeItem(key);
        console.log(`Cache antigo removido: ${key}`);
      }
    }
  });

  return getLatitudeAndLongitudeFromName( ...locationData )
    .then(async (coordinates) => { 
      if (!coordinates) return;

      const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&lang=pt_br&appid=${key}`;
      
      const response = await fetch(url);
      if (!response) return null;
      if (!response.ok) throw new Error(`Http error: ${response.status}`);

      const data = await response.json();
      if (!data) return;

      const loopDate = new Date(dateObj.getTime());

      for(let i = 0; i < 5; i ++){
        const targetDateStr = formatDate(loopDate);

        const todaySquares = data.list.filter(square => square.dt_txt.startsWith(targetDateStr));
        
        if (todaySquares.length === 0) continue; //specific case where the fifth day gets no squares due to time zone differences

        const todayWeatherData = {
          city: data.city.name,
          date: targetDateStr,
          squares: todaySquares
        }

        localStorage.setItem(`weather_${targetDateStr}`, JSON.stringify(todayWeatherData));

        loopDate.setDate(loopDate.getDate() + 1);
      }

      const resultadoFinal = JSON.parse(localStorage.getItem(`weather_${dateStr}`));
      console.log("=== Resultado da API gravado com sucesso ===");
      console.log(resultadoFinal);
      
      return resultadoFinal;
    })
    .catch(error => {
      console.error(error.message);
      return;
    })
}

function formatDate(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

