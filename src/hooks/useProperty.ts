// Re-export the context-backed hook so all screens share a single source of
// truth for the selected property. The actual state lives in PropertyContext.
export { useProperty } from '../context/PropertyContext';
