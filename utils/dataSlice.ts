import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";

// Thunk untuk fetch data
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

// Thunk untuk fetch detail data
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

// Thunk untuk delete data
export const deleteData = createAsyncThunk(
  "data/deleteData",
  async (id: any, { rejectWithValue }) => {
    try {
      await axios.delete(`https://contact.herokuapp.com/contact/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue("Error deleting data");
    }
  }
);

// State interface
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

// Data slice
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetch data
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
      // Handle fetch detail data
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
      })
      // Handle delete data
      .addCase(deleteData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteData.rejected, (state, action) => {
        state.isLoading = false;
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
