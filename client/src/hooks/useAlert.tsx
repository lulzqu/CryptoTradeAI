import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAlerts, 
  fetchAlertById, 
  createAlert, 
  updateAlert, 
  deleteAlert, 
  triggerAlert,
  setSelectedAlert,
  clearAlertErrors,
  selectAllAlerts,
  selectSelectedAlert,
  selectAlertsLoading,
  selectAlertsError,
  selectAlertCreating,
  selectAlertUpdating,
  selectAlertDeleting,
  selectActiveAlerts,
  selectTriggeredAlerts,
  selectPriceAlerts,
  selectIndicatorAlerts,
  selectRiskAlerts
} from '../store/slices/alertSlice';
import { Alert, AlertQueryParams } from '../services/AlertService';
import { AppDispatch } from '../store/store';

const useAlert = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const alerts = useSelector(selectAllAlerts);
  const selectedAlert = useSelector(selectSelectedAlert);
  const loading = useSelector(selectAlertsLoading);
  const error = useSelector(selectAlertsError);
  const creating = useSelector(selectAlertCreating);
  const updating = useSelector(selectAlertUpdating);
  const deleting = useSelector(selectAlertDeleting);
  
  // Filtered alerts
  const activeAlerts = useSelector(selectActiveAlerts);
  const triggeredAlerts = useSelector(selectTriggeredAlerts);
  const priceAlerts = useSelector(selectPriceAlerts);
  const indicatorAlerts = useSelector(selectIndicatorAlerts);
  const riskAlerts = useSelector(selectRiskAlerts);
  
  // Actions
  const getAlerts = useCallback((params?: AlertQueryParams) => {
    return dispatch(fetchAlerts(params));
  }, [dispatch]);
  
  const getAlertById = useCallback((alertId: string) => {
    return dispatch(fetchAlertById(alertId));
  }, [dispatch]);
  
  const addAlert = useCallback((alertData: Omit<Alert, '_id' | 'createdAt' | 'updatedAt' | 'triggerCount' | 'lastTriggered'>) => {
    return dispatch(createAlert(alertData));
  }, [dispatch]);
  
  const editAlert = useCallback((alertId: string, alertData: Partial<Alert>) => {
    return dispatch(updateAlert({ alertId, alertData }));
  }, [dispatch]);
  
  const removeAlert = useCallback((alertId: string) => {
    return dispatch(deleteAlert(alertId));
  }, [dispatch]);
  
  const activateAlert = useCallback((alertId: string) => {
    return dispatch(triggerAlert(alertId));
  }, [dispatch]);
  
  const selectAlert = useCallback((alert: Alert | null) => {
    dispatch(setSelectedAlert(alert));
  }, [dispatch]);
  
  const clearErrors = useCallback(() => {
    dispatch(clearAlertErrors());
  }, [dispatch]);
  
  return {
    // State
    alerts,
    selectedAlert,
    loading,
    error,
    creating,
    updating,
    deleting,
    
    // Filtered alerts
    activeAlerts,
    triggeredAlerts,
    priceAlerts,
    indicatorAlerts,
    riskAlerts,
    
    // Actions
    getAlerts,
    getAlertById,
    addAlert,
    editAlert,
    removeAlert,
    activateAlert,
    selectAlert,
    clearErrors
  };
};

export default useAlert; 