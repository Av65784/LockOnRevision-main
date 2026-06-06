import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

export const TESTS = [
  { id: "foundations-easy", title: "Foundations Sprint", difficulty: "Easy", energy: 1, xp: 100 },
  { id: "mixed-medium", title: "Mixed Recall", difficulty: "Medium", energy: 2, xp: 180 },
  { id: "deep-hard", title: "Deep Focus Trial", difficulty: "Hard", energy: 3, xp: 260 },
];

export const UNITS = [
  { id: "unit-active-recall", title: "Active Recall Basics", xp: 60 },
  { id: "unit-spaced-repetition", title: "Spaced Repetition", xp: 60 },
  { id: "unit-exam-strategy", title: "Exam Strategy", xp: 60 },
];

const TEN_MINUTES = 10 * 60 * 1000;

export function calculateTotalScore(xp = 0, energy = 0) {
  return Number(xp || 0) + Number(energy || 0) * 100;
}

function lastAttemptMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value === "string") return Date.parse(value);
  return Number(value) || 0;
}

export async function completeMockTest(uid, testId, score) {
  if (!db) throw new Error("Firebase is not configured.");

  const test = TESTS.find((item) => item.id === testId);
  if (!test) throw new Error("Test not found.");
  if (Number(score) < 60) throw new Error("Score must be at least 60% to earn energy.");

  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists()) throw new Error("User profile not found.");

    const data = snapshot.data();
    const completedTests = data.completedTests || [];
    if (completedTests.includes(testId)) throw new Error("This test has already awarded energy.");

    const lastAttempt = lastAttemptMs(data.lastTestAttempt);
    if (lastAttempt && Date.now() - lastAttempt < TEN_MINUTES) {
      const remaining = Math.ceil((TEN_MINUTES - (Date.now() - lastAttempt)) / 60000);
      throw new Error(`Mock test cooldown active. Try again in ${remaining} min.`);
    }

    const nextXp = Number(data.xp || 0) + test.xp;
    const nextEnergy = Number(data.energy || 0) + test.energy;
    const nextTotal = calculateTotalScore(nextXp, nextEnergy);

    transaction.update(userRef, {
      xp: nextXp,
      energy: nextEnergy,
      totalScore: nextTotal,
      completedTests: [...completedTests, testId],
      lastTestAttempt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { earnedEnergy: test.energy, earnedXp: test.xp, totalScore: nextTotal };
  });
}

export async function completeUnit(uid, unitId) {
  if (!db) throw new Error("Firebase is not configured.");

  const unit = UNITS.find((item) => item.id === unitId);
  if (!unit) throw new Error("Unit not found.");

  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    if (!snapshot.exists()) throw new Error("User profile not found.");

    const data = snapshot.data();
    const completedUnits = data.completedUnits || [];
    if (completedUnits.includes(unitId)) throw new Error("This unit has already awarded energy.");

    const nextXp = Number(data.xp || 0) + unit.xp;
    const nextEnergy = Number(data.energy || 0) + 1;
    const nextTotal = calculateTotalScore(nextXp, nextEnergy);

    transaction.update(userRef, {
      xp: nextXp,
      energy: nextEnergy,
      totalScore: nextTotal,
      completedUnits: [...completedUnits, unitId],
      updatedAt: serverTimestamp(),
    });

    return { earnedEnergy: 1, earnedXp: unit.xp, totalScore: nextTotal };
  });
}

export async function fetchLeaderboard() {
  if (!db) throw new Error("Firebase is not configured.");

  const snapshot = await getDocs(query(collection(db, "users"), orderBy("totalScore", "desc"), limit(50)));
  return snapshot.docs.map((item, index) => ({ id: item.id, rank: index + 1, ...item.data() }));
}
