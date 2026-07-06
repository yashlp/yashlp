const ADJECTIVES = [
  "Quiet",
  "Curious",
  "Swift",
  "Bright",
  "Urban",
  "Local",
  "Calm",
  "Wise",
  "Active",
  "Friendly",
  "Alert",
  "Keen",
];

const NOUNS = [
  "Citizen",
  "Scout",
  "Walker",
  "Watcher",
  "Reporter",
  "Mapper",
  "Neighbor",
  "Lens",
  "Observer",
  "Helper",
  "Explorer",
  "Guardian",
];

export const MAX_NAME_CHANGES = 2;

export function generateRandomDisplayName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${adj}${noun}${num}`;
}

export function nameChangesRemaining(changeCount: number): number {
  return Math.max(0, MAX_NAME_CHANGES - changeCount);
}

export function canChangeName(changeCount: number): boolean {
  return changeCount < MAX_NAME_CHANGES;
}
