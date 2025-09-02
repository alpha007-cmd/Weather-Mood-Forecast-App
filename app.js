const apikey = "326d1deaf6384a5791c739efe457f191";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather img");
const moodText = document.querySelector(".mood-text");

const moodKeywords = {
    Clear: {
        mood: "Bright and cheerful 🌞",
        activity: "Go for a walk or a picnic 🥪",
        music: "Upbeat happy playlist 🎶"
    },
    Clouds: {
        mood: "Calm and cozy ☁️",
        activity: "Read a book or watch a movie 📖🎬",
        music: "Lo-fi chill beats 🎧"
    },
    Rain: {
        mood: "Relaxed and moody 🌧️",
        activity: "Cozy up with tea ☕",
        music: "Chill acoustic playlist 🎶"
    },
    Drizzle: {
        mood: "Mellow drizzle vibes 🌦️",
        activity: "Light journaling or sketching ✍️",
        music: "Soft indie music 🎶"
    },
    Thunderstorm: {
        mood: "Energetic ⚡",
        activity: "Indoor workout or gaming 🕹️",
        music: "High-energy rock playlist 🎸"
    },
    Snow: {
        mood: "Playful ❄️",
        activity: "Hot chocolate + Netflix 🍫",
        music: "Cozy winter playlist 🎶"
    },
    Mist: {
        mood: "Dreamy 🌫️",
        activity: "Meditate or listen to calming music 🧘",
        music: "Ambient soundscapes 🎶"
    },
    Haze: {
        mood: "Chill 😌",
        activity: "Catch up on podcasts 🎙️",
        music: "Lo-fi chillhop 🎶"
    },
    Fog: {
        mood: "Mysterious 🌁",
        activity: "Journal or reflect quietly ✍️",
        music: "Soft piano playlist 🎹"
    }
};

// Spotify API token
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

// random track by keyword
async function getRandomTrack(keyword, token) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(keyword)}&type=track&limit=20`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const data = await response.json();

  if (!data.tracks || data.tracks.items.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * data.tracks.items.length);
  return data.tracks.items[randomIndex];
}

// weather check function
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
  let moodMessage = "Enjoy your day 🎵";

  if (moodKeywords[weatherCondition]) {
    moodMessage = moodKeywords[weatherCondition].mood;   
    keyword = moodKeywords[weatherCondition].music;      
    activity = moodKeywords[weatherCondition].activity;  
  }

  moodText.textContent = moodMessage;

  const token = await getSpotifyToken();
  const track = await getRandomTrack(keyword, token);

  if (track) {
    document.getElementById("spotify-player").innerHTML = `
      <p><strong>Suggested activity:</strong> ${activity}</p> <br>
      <p><strong>Song Suggestion:</strong> ${track.name} <br>
      <em>by ${track.artists.map(a => a.name).join(", ")}</em></p>
      <iframe src="https://open.spotify.com/embed/track/${track.id}"
        width="100%" height="80" frameborder="0" allow="encrypted-media"></iframe>
    `;
  } else {
    document.getElementById("spotify-player").innerHTML = `
      <p>No song suggestion found 🎶</p>
      <p><strong>Suggested activity:</strong> ${activity}</p>
    `;
  }

  document.querySelector(".weather").style.display = "block";
}

// ✅ Search event
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});
