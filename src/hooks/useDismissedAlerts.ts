// Re-export the context-backed hook so all screens share a single source of
// truth for dismissed alerts. The actual state lives in DismissedAlertsContext.
export { useDismissedAlerts } from '../context/DismissedAlertsContext';
