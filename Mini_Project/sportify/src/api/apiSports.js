// src/api/apiSports.js
import axios from "axios";

// ⚠️ Replace with your API keys
const FOOTBALL_API_KEY = "7640a8de8074b8683b8471a35200d676";
const NFL_API_KEY = "7640a8de8074b8683b8471a35200d676";
const NBA_API_KEY = "7640a8de8074b8683b8471a35200d676";
const F1_API_KEY = "7640a8de8074b8683b8471a35200d676";

// Common headers
const footballHeaders = { "x-apisports-key": FOOTBALL_API_KEY };
const nflHeaders = { "x-apisports-key": NFL_API_KEY };
const nbaHeaders = { "x-rapidapi-key": NBA_API_KEY, "x-rapidapi-host": "v2.nba.api-sports.io" };
const f1Headers = { "x-apisports-key": F1_API_KEY };

// ---------------- FOOTBALL ----------------
export const fetchFootballMatches = async () => {
  // 4 leagues: Premier League(39), La Liga(140), Bundesliga(78), Serie A(135)
  const leagues = [
    { id: 39, name: "Premier League" },
    { id: 140, name: "La Liga" },
    { id: 78, name: "Bundesliga" },
    { id: 135, name: "Serie A" },
  ];
  const season = 2023;

  try {
    const requests = leagues.map(league =>
      axios.get(
        `https://v3.football.api-sports.io/fixtures?league=${league.id}&season=${season}&last=1`,
        { headers: footballHeaders }
      )
    );

    const responses = await Promise.all(requests);
    const matches = responses.map((res, i) => {
      const fixture = res.data.response[0];
      return {
        league: leagues[i].name,
        home: fixture.teams.home.name,
        away: fixture.teams.away.name,
        homeScore: fixture.goals.home,
        awayScore: fixture.goals.away,
        date: fixture.fixture.date,
      };
    });
    return matches;
  } catch (error) {
    console.error("Football API error:", error);
    return [];
  }
};

// ---------------- NBA ----------------
export const fetchNBAGames = async () => {
  const season = 2019; // free tier season
  try {
    const res = await axios.get(
      `https://v2.nba.api-sports.io/games?league=standard&season=${season}`,
      { headers: nbaHeaders }
    );
    // Pick 4 random games
    const games = res.data.response.slice(0, 4);
    return games.map(game => ({
      homeTeam: game.teams.home.name,
      awayTeam: game.teams.away.name,
      homeScore: game.scores.home.points,
      awayScore: game.scores.away.points,
      date: game.date,
    }));
  } catch (error) {
    console.error("NBA API error:", error);
    return [];
  }
};

// ---------------- NFL ----------------
export const fetchNFLGames = async () => {
  const season = 2022;
  const league = 1; // NFL league id
  try {
    const res = await axios.get(
      `https://v1.american-football.api-sports.io/games?league=${league}&season=${season}`,
      { headers: nflHeaders }
    );
    // Pick 4 random games
    const games = res.data.response.slice(0, 4);
    return games.map(game => ({
      homeTeam: game.teams.home.name,
      awayTeam: game.teams.away.name,
      homeScore: game.scores.home.total,
      awayScore: game.scores.away.total,
      date: game.date,
    }));
  } catch (error) {
    console.error("NFL API error:", error);
    return [];
  }
};

// ---------------- F1 ----------------
export const fetchF1Race = async () => {
  const season = 2023;
  try {
    // Get last race
    const raceRes = await axios.get(
      `https://v1.formula-1.api-sports.io/races?season=${season}&last=1`,
      { headers: f1Headers }
    );
    const race = raceRes.data.response[0];

    // Get driver standings for this race (top 3)
    const standingsRes = await axios.get(
      `https://v1.formula-1.api-sports.io/rankings/races?race=${race.id}`,
      { headers: f1Headers }
    );
    const standings = standingsRes.data.response
      .slice(0, 3)
      .map(driver => ({
        position: driver.position,
        driver: driver.driver.name,
        team: driver.team.name,
        points: driver.points,
      }));

    return {
      circuit: {
        name: race.circuit.name,
        date: race.date,
        image: race.circuit.image || "https://via.placeholder.com/150", // fallback image
      },
      standings,
    };
  } catch (error) {
    console.error("F1 API error:", error);
    return null;
  }
};
