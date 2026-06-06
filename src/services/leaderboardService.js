import { fetchLeaderboard } from "./userService.js";

// Leaderboard service scaffold.
// TODO: connect this to Firestore query:
// users orderBy totalScore desc limit 50.
export async function getTopLeaderboardUsers() {
  return fetchLeaderboard();
}
