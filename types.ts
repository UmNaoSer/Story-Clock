
// Fix: Added missing type definitions for CreatedWord, LuminarLetter, and DictionaryWord.
export interface CreatedWord {
  word: string;
  meaning: string;
  svg: string;
  category: string;
}

export interface LuminarLetter {
  name: string;
  path: string;
  meaning: string;
  category: string;
  color: string;
}

export interface DictionaryWord {
  word: string;
  meaning: string;
}

export interface LensSection {
  focalLength: string;
  title: string;
  description: string;
  iconPath: string; // SVG path for an icon
  points: {
    title: string;
    content: string;
  }[];
}

export interface StructuredContent {
  introduction: string;
  sections: LensSection[];
  conclusion?: {
    title: string;
    content: string;
  };
}

export interface ComicCommandment {
  number: number;
  title: string;
  description: string;
}

export interface ComicPageContent {
  introduction: string;
  commandments: ComicCommandment[];
  conclusion?: {
    title: string;
    content: string;
  };
}

export interface ShotType {
  number: number;
  title: string;
  subtitle: string;
  description: string;
}

export interface BonusSection {
  title: string;
  content: string;
  topics: {
    title: string;
    subtitle?: string;
    content: string;
  }[];
}

export interface ShotTypeContent {
  introduction: string;
  shots: ShotType[];
  bonus?: BonusSection;
}

export interface VideoSection {
  title: string;
  content: string;
}

export interface VideoArticleContent {
  videoId: string;
  title: string;
  introduction: string;
  sections: VideoSection[];
  conclusion?: {
    title: string;
    content: string;
  };
}

export interface CatalogTopic {
  name: string;
  meaning: string;
  category: string;
  fullDescription: string | StructuredContent | ComicPageContent | ShotTypeContent | VideoArticleContent;
  path: string;
  color?: string;
}

export type BeatStyle = 'dot' | 'line';
export type BeatSize = 'small' | 'medium' | 'large';
export type TextDisplayMode = 'visible' | 'hover' | 'tooltip';

export interface StoryBeat {
  id: string;
  title: string;
  timeAngle: number; // Angle in degrees (0-360) where 0 is 12 o'clock. Used for X-axis in Linear view.
  y?: number; // 0-100 scale for vertical position in Linear view (Intensity).
  color: string;
  style: BeatStyle;
  size: BeatSize;
  textMode: TextDisplayMode;
}

export interface StoryConnection {
  id: string;
  fromBeatId: string;
  toBeatId: string;
}

export enum Tab {
  Catalog = 'CATÁLOGO',
  VideoAnalyzer = 'ANALISADOR DE VÍDEO',
  StoryClock = 'STORY CLOCK',
}

declare global {
  interface Window {
    marked: {
      parse: (markdown: string, options?: object) => string;
    };
  }
}