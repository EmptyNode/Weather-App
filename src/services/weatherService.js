import { DateTime } from "luxon";
const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";
console.log(API_KEY);


//by city name api url → https://api.openweathermap.org/data/2.5/weather?q={Kolkata}&appid={7aa3c6b386b8b646e8b359a0ff7e3396}

//one call api url → https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly&appid=7aa3c6b386b8b646e8b359a0ff7e3396

//2. this function will be called by the 1st called function getFormattedWeatherData
//5. this function will be called again by the function formattedForecastWeather
const getWeatherData = (infoType, searchParams) => {

    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({...searchParams, appid: API_KEY});
    return fetch(url).then((res) => res.json())
};

const formatCurrentWeather = (data) =>{
    const{
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data

    const {main: details, icon} = weather[0]

    return {lat, lon, temp, feels_like, temp_min, temp_max, humidity, name, dt,country, sunrise, sunset, details, icon, speed}
}

const formatForecastWeather = (data) => {
    let { timezone, daily, hourly} = data;
    daily = daily.slice(1,6).map(d => {
        return{
            title: formatToLocalTime(d.dt, timezone, "ccc"),
            temp: d.temp.day,
            icon: d.weather[0].icon,
        }
    });

    hourly = hourly.slice(1,6).map((h) => {
        return{
            title: formatToLocalTime(h.dt, timezone, "hh:mm a"),
            temp: h.temp,
            icon: h.weather[0].icon,
        };
    });

    return { timezone, daily, hourly};

    
}

//1st this function will be called from app.js with a parameter cityName(searchParams)
const getFormattedWeatherData = async(searchParams) => {
//2nd function is written on the top which is called from here
    const formattedCurrentWeather = await getWeatherData('weather',searchParams).then(formatCurrentWeather);
//3rdly json format of weather data will be collected here in formattedCurrentWeather    
//4th in the variable lat and lon data lat and lon from the json file will be stored
    const { lat, lon } = formattedCurrentWeather;

//5th getWeatherData function will call again but with different parameters mentioned below

//one call api url → https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly&appid=7aa3c6b386b8b646e8b359a0ff7e3396

    const formattedForecastWeather = await getWeatherData("onecall", { 
        lat, 
        lon, 
        exclude: "current, minutely, alerts", 
        units: searchParams.units,
    }).then(formatForecastWeather);

    return {...formattedCurrentWeather, ...formattedForecastWeather};
}

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd, LLL, yyyy' | Localtime: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `http://openweathermap.org/img/wn/${code}@2x.png`    

export default getFormattedWeatherData;

export {formatToLocalTime, iconUrlFromCode};