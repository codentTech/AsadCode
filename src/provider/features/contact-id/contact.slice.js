// contactSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  contactId: null,
  openPopupContact: false
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setContactId: (state, action) => {
      state.contactId = action.payload;
    },
    setOpenPopupContact: (state, action) => {
      state.openPopupContact = action.payload;
    }
  }
});

export const { setContactId, setOpenPopupContact } = contactSlice.actions;
export default contactSlice.reducer;
