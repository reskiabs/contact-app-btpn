import { combineReducers, configureStore } from "@reduxjs/toolkit";
import dataReducer from "./dataSlice";

const rootReducer = combineReducers({
  data: dataReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export default store;
