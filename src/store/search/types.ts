export interface SearchState {
  keyword: string;
  suggestions: SearchSuggestion[];
  results: SearchResult[];
  loading: boolean;
  isSearchActive: boolean;
}

export interface SearchSuggestion {
  id: string;
  text: string;
  subText: string;
  type: 'location' | 'food' | 'activity';
  icon: string;
}

export interface SearchResult {
  id: string;
  title: string;
  subTitle: string;
  type: 'location' | 'food' | 'activity';
  image: string;
  tags: string[];
} 