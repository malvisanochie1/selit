import { SITE } from '../config/site';
import { slugify } from '../utils/slug';

import type { School, SchoolKind } from './school.types';
import { SCHOOLS } from './schools.data';

export { SCHOOLS };

export const NIGERIAN_STATES = [
  'Abia',
  'Adamawa',
  'Akwa Ibom',
  'Anambra',
  'Bauchi',
  'Bayelsa',
  'Benue',
  'Borno',
  'Cross River',
  'Delta',
  'Ebonyi',
  'Edo',
  'Ekiti',
  'Enugu',
  'FCT',
  'Gombe',
  'Imo',
  'Jigawa',
  'Kaduna',
  'Kano',
  'Katsina',
  'Kebbi',
  'Kogi',
  'Kwara',
  'Lagos',
  'Nasarawa',
  'Niger',
  'Ogun',
  'Ondo',
  'Osun',
  'Oyo',
  'Plateau',
  'Rivers',
  'Sokoto',
  'Taraba',
  'Yobe',
  'Zamfara',
] as const;

export const SCHOOL_KIND_LABELS: Record<SchoolKind, string> = {
  university: 'University',
  polytechnic: 'Polytechnic',
  'college-of-education': 'College of education',
  monotechnic: 'Monotechnic',
};

const bySlug = new Map(SCHOOLS.map((school) => [school.slug, school]));
const byName = new Map(SCHOOLS.map((school) => [school.name.toLowerCase(), school]));

export function findSchoolBySlug(slug: string) {
  return bySlug.get(slug) ?? null;
}

export function findSchoolByName(name: string) {
  return byName.get(name.trim().toLowerCase()) ?? null;
}

export function stateSlug(state: string) {
  return slugify(state === 'FCT' ? 'FCT Abuja' : state);
}

export function stateLabel(state: string) {
  return state === 'FCT' ? 'FCT, Abuja' : `${state} State`;
}

export function schoolsInState(state: string) {
  return SCHOOLS.filter((school) => school.state === state);
}

/** States in the order shown to people: the launch state first, then A to Z. */
export function orderedStates() {
  return [SITE.launchState, ...NIGERIAN_STATES.filter((state) => state !== SITE.launchState)];
}

export function displayName(school: School) {
  return school.shortName ? `${school.shortName} · ${school.city || school.state}` : school.name;
}

function normalise(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Ranks schools by how well they match what someone typed, launch state first on ties. */
export function searchSchools(query: string, limit = 8): School[] {
  const needle = normalise(query);
  if (!needle) {
    return SCHOOLS.filter((school) => school.state === SITE.launchState).slice(0, limit);
  }
  const words = needle.split(' ');
  return SCHOOLS.map((school) => {
    const haystack = normalise(`${school.name} ${school.shortName} ${school.city} ${school.state}`);
    if (!words.every((word) => haystack.includes(word))) return null;
    const short = normalise(school.shortName);
    let score = 0;
    if (short === needle) score += 100;
    if (short.startsWith(needle)) score += 40;
    if (normalise(school.name).startsWith(needle)) score += 30;
    if (normalise(school.city).startsWith(needle)) score += 15;
    if (school.state === SITE.launchState) score += 5;
    return { school, score };
  })
    .filter((entry): entry is { school: School; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score || a.school.name.localeCompare(b.school.name))
    .slice(0, limit)
    .map((entry) => entry.school);
}

/** Public meet-up points suggested per school. Sellers can also type their own. */
export function suggestedMeetupSpots(schoolName: string) {
  const school = findSchoolByName(schoolName);
  const short = school?.shortName || 'campus';
  return [
    `Main gate, ${short}`,
    `Campus security post, ${short}`,
    `Library entrance, ${short}`,
    `ICT centre, ${short}`,
    `Busy junction near ${school?.city || 'campus'}`,
  ];
}
