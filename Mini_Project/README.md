<h1>Sportify – Sports Scoreboard App</h1>Sportify is a real-time sports scoreboard app built with React Native (Expo) that delivers live match updates, team information, standings, and player data across multiple sports. The app integrates Firebase for backend services and API-Sports.io to fetch authenticated, real-time sports data.


---

<h2>🛠 Tech Stack</h2>React Native (Expo): Cross-platform UI for Android & iOS

JavaScript: App logic and API handling

Firebase SDK: Authentication + Firestore database + Storage

API-Sports.io: REST API provider for multi-sport data

Endpoints used: Basketball, NBA, Football, Formula 1




---

<h2>✨ Features</h2>1. Firebase Integration

Firebase is used as the app’s backend for supporting user-related functionality.

Authentication:
Handles user login, signup, and session persistence using Firebase Auth.

Cloud Firestore:
Used to store users’ favorite teams, recently viewed matches, and personalized preferences.

Firebase Storage:
Stores static assets or user-uploaded images if required (ex: profile picture).


Overall, Firebase helps maintain a seamless user experience with cloud-sync and secure data storage.


---

2. REST API – API-Sports.io

Sportify uses API-Sports.io for all real-time sports data. The following major API groups are utilized:

Basketball API

Fetches basketball leagues, teams, standings, and ongoing match scores

Used for displaying live match cards, schedules, and game details


NBA API

Provides NBA-specific data such as:

Live NBA scores

Regular season and playoff schedules

Player stats and team rosters


Used to show NBA-only filters and dashboards for fans


Football API

Includes major football leagues: Premier League, La Liga, Champions League, etc.

Retrieves:

Live match data

Standings & league tables

Team details

Fixtures & historical match results


Used heavily for real-time football score tracking


Formula 1 (F1) API

Provides motorsport data such as:

Race results
Driver standings
Constructor standings
Circuit information


Used to show F1-specific dashboards for race weekends


All API calls are made using secured request headers and structured into reusable service functions.


---

<h2>📌 Short Description</h2>Sportify is a multi-sport live scoreboard app providing real-time scores, match insights, league standings, and team information using API-Sports.io (Basketball, NBA, Football, F1). With Firebase powering authentication and data storage, the app delivers a fast, reliable, and personalized sports-tracking experience across devices.
