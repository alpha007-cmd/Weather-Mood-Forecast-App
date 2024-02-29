


const apikey="326d1deaf6384a5791c739efe457f191";
const apiUrl="https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox =document.querySelector(".search input");
const searchBtn =document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather img");

async function checkWeather(city){
  const response =await fetch(apiUrl + city +`&appid=${apikey}`);
  var  data = await response.json();

  console.log(data)
  document.querySelector(".city").innerHTML=data.name;
  document.querySelector(".temp").innerHTML=Math.round(data.main.temp)+"°c";
  document.querySelector(".humidity").innerHTML=data.main.humidity+"%";
  document.querySelector(".wind").innerHTML=data.wind.speed+"km/h";
  
  if(data.weather[0].main == "clouds"){
    weatherIcon.src = "images/clouds.png";
  }
  else if(data.weather[0].main == "clear"){
    weatherIcon.src = "images/clear.png";
  }
  else if(data.weather[0].main =="rain"){
    weatherIcon.src = "images/rain.png";
  }
  else if(data.weather[0].main =="drizzle"){
    weatherIcon.src = "images/drizzle.png";
  }
  else if(data.weather[0].main =="mist"){
    weatherIcon.src = "images/mist.png";
  };

  document.querySelector(".weather").style.display ="block";
 

};

searchBtn.addEventListener("click",()=>{
  checkWeather(searchBox.value);
})




