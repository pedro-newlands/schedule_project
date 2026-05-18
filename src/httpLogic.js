export default function attachWeatherToActivity(activity, todayWeatherData){
  if (!activity || !todayWeatherData?.squares) return activity;
  
  const todayWeatherList = todayWeatherData.squares;

  const [hourActivity, minActivity] = activity.getHour()?.split(':').map(Number);
  const totalActivityMinutes = (hourActivity * 60) + minActivity;

  let closestSquare = null;
  let smallestTimedifference = 180;

  for (const element of todayWeatherList) {
    const squareHour = parseInt(element.dt_txt.split(' ')[1].split(':')[0]);
    const totalSquareMinutes = squareHour * 60;

    const difference = Math.abs(totalActivityMinutes - totalSquareMinutes);

    if (difference < smallestTimedifference) {
      smallestTimedifference = difference;
      closestSquare = element;
    } else { continue; }

  };

  if (closestSquare) {
      activity.weather = {
        temperature: closestSquare.main.temp,
        condition: closestSquare.weather[0].main,
        description: closestSquare.weather[0].description,
        icon: closestSquare.weather[0].icon,
        hour: closestSquare.dt_txt.split(' ')[1].substring(0, 5)
      }

      activity.getWeather = function() {
        return this.weather;
      }
  }

  return activity;
}