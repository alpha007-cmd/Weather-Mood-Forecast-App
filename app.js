const apikey = "326d1deaf6384a5791c739efe457f191";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather img");

const moodText = document.querySelector(".mood-text");

const moodKeywords = {
  Clear: { text: "Sunny vibes 🌞", keyword: "happy summer", activity: "Perfect day for a walk 🚶‍♂️" },
  Clouds: { text: "Lo-Fi cloudy beats ☁️", keyword: "lofi chill", activity: "Cozy up with a book 📖" },
  Rain: { text: "Rainy chill ☔", keyword: "rainy mood", activity: "Sip hot tea and relax ☕" },
  Snow: { text: "Snowy acoustic ❄️", keyword: "acoustic winter", activity: "Stay warm indoors 🔥" },
  Mist: { text: "Misty calm 🌫️", keyword: "ambient calm", activity: "Meditate or stretch 🧘" },
  Drizzle: { text: "Drizzle beats 🌧️", keyword: "chill beats", activity: "Journal or doodle ✍️" }
};

async function getSpotifyToken() {
  const clientId = "405f514217474a0a82820d817d86b3f2";
  const clientSecret = "9625360e43b3458ea81c829dc76ce8f5";

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + btoa(clientId + ":" + clientSecret),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await response.json();
  return data.access_token;
}

async function getRandomTrack(keyword, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(keyword)}&type=track&limit=20`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  const data = await response.json();

  if (!data.tracks || data.tracks.items.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * data.tracks.items.length);
  return data.tracks.items[randomIndex];
}

async function checkWeather(city) {
  const response = await fetch(`${apiUrl}${city}&appid=${apikey}`);
  const data = await response.json();

  if (data.cod === "404") {
    alert("City not found!");
    return;
  }

  document.querySelector(".city").innerHTML = data.name;
  document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c";
  document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
  document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

  const weatherCondition = data.weather[0].main;

  let keyword = "top hits";
  let activity = "Enjoy your day 🎵";

  if (moodKeywords[weatherCondition]) {
    moodText.textContent = moodKeywords[weatherCondition].text;
    keyword = moodKeywords[weatherCondition].keyword;
    activity = moodKeywords[weatherCondition].activity;
  } else {
    moodText.textContent = "Enjoy your day 🎵";
  }

  const token = await getSpotifyToken();
  const track = await getRandomTrack(keyword, token);

  if (track) {
    document.getElementById("spotify-player").innerHTML = `
      <p><strong>Track:</strong> ${track.name} <br/> 
      <em>by ${track.artists.map(a => a.name).join(", ")}</em></p>
      <iframe src="https://open.spotify.com/embed/track/${track.id}"
        width="100%" height="80" frameborder="0" allow="encrypted-media"></iframe>
      <p><strong>Suggested activity:</strong> ${activity}</p>
    `;
  }

  document.querySelector(".weather").style.display = "block";
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
