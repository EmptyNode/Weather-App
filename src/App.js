
import './App.css';
import UilReact from '@iconscout/react-unicons/icons/uil-react';
import TopButtons from './components/TopButtons';
import Inputs from './components/Inputs';
import TimeAndLocation from './components/TimeAndLocation';
import TempratureAndDetails from './components/TempratureAndDetails';
import Forecast from './components/Forecast';
import getFormattedWeatherData from './services/weatherService';
import { useEffect, useState } from 'react';

//react toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [query, setQuery] = useState({ q: 'assam' });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const message = query.q
      toast.info('fetching weather for ' + message)
      const data = await getFormattedWeatherData({ ...query, units }).then(
        (data) => {
          toast.success(`successfully fetched weather for ${data.name}, ${data.country}`)
          setWeather(data);
          console.log(data);
        })
    }
    fetchWeather();
  }, [query, units])

  const formatBackground = () => {
    if (!weather) return 'from-cyan-700 to-blue-700'
    const threshold = units === 'metric' ? 20 : 60
    if (weather.temp <= threshold) return 'from-cyan-700 to-blue-700'
    return 'from-yellow-700 to-orange-700'
  }
  return (
      <div className={`mx-auto max-w-screen-sm mt-4 py-5 px-14 bg-gradient-to-br from-cyan-700 to-blue-700 h-fit shadow-xl shadow-gray-400 ${formatBackground()}`}>
        <TopButtons setQuery={setQuery} />
        <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />
        {weather &&
          <div>
            <TimeAndLocation weather={weather} />
            <TempratureAndDetails weather={weather} />
            <Forecast title="houtly forecast" items={weather.hourly} />
            <Forecast title="daily forecast" items={weather.daily} />
          </div>
        }

        <ToastContainer autoClose={5000} theme="colored" newestOnTop={true} />
        <h1 className='text-white text-sm font-medium flex items-center justify-around my-6'>copyright @sumit made by &#128153; SUMIT CHAKRABORTY</h1>
      </div>

  );
}

export default App;
