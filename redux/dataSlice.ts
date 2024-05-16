import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";

export const fetchData = createAsyncThunk(
  "data/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://contact.herokuapp.com/contact");
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchDetailData = createAsyncThunk(
  "data/fetchDetailData",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://contact.herokuapp.com/contact/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue("Error fetching detail data");
    }
  }
);

interface DataState {
  data: any[];
  detailData: any;
  isLoading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: DataState = {
  data: [],
  detailData: {},
  isLoading: false,
  detailLoading: false,
  error: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDetailData.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchDetailData.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.detailData = action.payload;
      })
      .addCase(fetchDetailData.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

export default dataSlice.reducer;

export const selectData = (state: RootState) => state.data.data;

export const selectDetailData = (state: RootState) => state.data.detailData;

export const selectError = (state: RootState) => state.data.error;

export const selectIsLoading = (state: RootState) => state.data.isLoading;

export const selectDetailLoading = (state: RootState) =>
  state.data.detailLoading;
