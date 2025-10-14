import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: "movie",
  initialState: {
    toggle: false,
  },
  reducers: {
    setToggleSearch: (state, action) => {
      state.toggle = action.payload;
    },
  },
});

export const { setToggleSearch } = movieSlice.actions;
export default movieSlice.reducer;
