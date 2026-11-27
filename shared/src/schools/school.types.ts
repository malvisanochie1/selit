export type SchoolKind = 'university' | 'polytechnic' | 'college-of-education' | 'monotechnic';
export type SchoolOwnership = 'federal' | 'state' | 'private';

export type School = {
  slug: string;
  name: string;
  shortName: string;
  kind: SchoolKind;
  ownership: SchoolOwnership;
  city: string;
  state: string;
};
