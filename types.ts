
export interface Weather {
  temperature: string;
  condition: string;
  location: string;
}

export interface NewsArticle {
  headline: string;
  summary: string;
}

export interface Source {
  uri: string;
  title: string;
}

export interface BriefingData {
  weather: Weather;
  news: NewsArticle[];
  sources: Source[];
}
