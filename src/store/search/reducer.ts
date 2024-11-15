import { createReducer } from '@reduxjs/toolkit'
import { SearchState } from './types'
import * as actions from './actions'

const initialState: SearchState = {
  keyword: '',
  suggestions: [],
  results: [],
  loading: false,
  isSearchActive: false
}

export const searchReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(actions.setKeyword, (state, action) => {
      state.keyword = action.payload
    })
    .addCase(actions.setSuggestions, (state, action) => {
      state.suggestions = action.payload
    })
    .addCase(actions.setResults, (state, action) => {
      state.results = action.payload
    })
    .addCase(actions.setLoading, (state, action) => {
      state.loading = action.payload
    })
    .addCase(actions.setSearchActive, (state, action) => {
      state.isSearchActive = action.payload
    })
}) 