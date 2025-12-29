import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Document } from '../types/document';

interface DocumentState {
  documents: Document[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    fetchDocumentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDocumentsSuccess(state, action: PayloadAction<Document[]>) {
      state.loading = false;
      state.documents = action.payload;
    },
    fetchDocumentsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    addDocument(state, action: PayloadAction<Document>) {
      state.documents.push(action.payload);
    },
    removeDocument(state, action: PayloadAction<string>) {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    },
  },
});

export const {
  fetchDocumentsStart,
  fetchDocumentsSuccess,
  fetchDocumentsFailure,
  addDocument,
  removeDocument,
} = documentSlice.actions;

export default documentSlice.reducer;