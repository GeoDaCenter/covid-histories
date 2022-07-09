import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import submissionReducer from './submission/submissionSlice'
import surveyReducer from './survey/surveySlice'

const persistConfig = {
  key: 'root',
  version: 1,
  storage
}
const submissionConfig = {
  key: 'submission',
  storage,
  blacklist: ['isUploading']
}

const rootReducer = combineReducers({
  submission: persistReducer(submissionConfig, submissionReducer),
  survey: surveyReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    })
  // devTools: process.env.NODE_ENV !== 'production',
})
export let persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
