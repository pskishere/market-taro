import { createAction } from '@reduxjs/toolkit'
import { SearchSuggestion, SearchResult } from './types'

export const setKeyword = createAction<string>('search/setKeyword')
export const setSuggestions = createAction<SearchSuggestion[]>('search/setSuggestions')
export const setResults = createAction<SearchResult[]>('search/setResults')
export const setLoading = createAction<boolean>('search/setLoading')
export const setSearchActive = createAction<boolean>('search/setSearchActive') 