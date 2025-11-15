// utils/basketballTeams.js
export const basketballTeams = [
  { id: 139, name: "Denver Nuggets" },
  { id: 140, name: "Lakers" },
  { id: 141, name: "Warriors" },
  { id: 142, name: "Bulls" },
  { id: 143, name: "Celtics" },
  // add more teams as needed
];

// helper function to get team ID from name
export const getTeamIdByName = (name) => {
  const team = basketballTeams.find(
    (t) => t.name.toLowerCase() === name.toLowerCase()
  );
  return team ? team.id : null;
};
