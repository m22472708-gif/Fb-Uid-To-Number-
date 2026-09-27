export interface ContactRecord {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  banglaName?: string;
  phone: string;
  fbUid: string;
  fbUsername?: string;
  fbProfileUrl?: string;
  email?: string;
  gender?: string;
  city?: string;
  hometown?: string;
  relationshipStatus?: string;
  work?: string;
  birthday?: string;
  location?: string;
  bloodGroup?: string;
  occupation?: string;
  bio?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  operator?: string;
  createdAt: string;
  rawDbLine?: string; // The exact colon-separated line e.g. Phone:UID:First:Last:...
  tags?: string[];
}

export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
  matchedName?: string;
}

export type Language = 'bn' | 'en';
