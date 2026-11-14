import { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_METRICS, DAILY_CHECKLIST, STREAK_DATA, MISSION_DATA } from '../data/mockData.js';
import { evaluateAllMetrics, computeCrewHealthIndex } from '../utils/decisionEngine.js';

export function useHealthStore() {
  const [currentMetrics, setCurrentMetrics] = useState({ ...INITIAL_METRICS });
  const [alerts, setAlerts] = useState([]);
  const [checklistItems, setChecklistItems] = useState([...DAILY_CHECKLIST]);
  const [streakData] = useState({ ...STREAK_DATA });
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [commDelay, setCommDelay] = useState(MISSION_DATA.communicationDelay);
  const [missionElapsed, setMissionElapsed] = useState(MISSION_DATA.currentDay * 86400);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  const [crewHealthIndex, setCrewHealthIndex] = useState(85);
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const sensorIntervalRef = useRef(null);
  const commIntervalRef = useRef(null);
  const elapsedIntervalRef = useRef(null);

  // Recalculate alerts whenever metrics change
  useEffect(() => {
    const newAlerts = evaluateAllMetrics(currentMetrics);
    setAlerts(newAlerts.filter(a => !dismissedAlerts.has(a.id)));
    setCrewHealthIndex(computeCrewHealthIndex(currentMetrics));
  }, [currentMetrics, dismissedAlerts]);

  // Live sensor simulation — small random drift every 3s
  useEffect(() => {
    sensorIntervalRef.current = setInterval(() => {
      setCurrentMetrics(prev => {
        const jitter = (range) => (Math.random() - 0.5) * range;
        return {
          ...prev,
          heartRate: Math.max(45, Math.min(130, Math.round(prev.heartRate + jitter(4)))),
          spo2: Math.max(88, Math.min(100, parseFloat((prev.spo2 + jitter(0.6)).toFixed(1)))),
          coreTemp: Math.max(35, Math.min(39, parseFloat((prev.coreTemp + jitter(0.1)).toFixed(2)))),
        };
      });
      setLastSync(new Date().toLocaleTimeString());
    }, 3000);

    return () => clearInterval(sensorIntervalRef.current);
  }, []);

  // Communication delay countdown — resets every ~20 minutes
  useEffect(() => {
    commIntervalRef.current = setInterval(() => {
      setCommDelay(prev => (prev <= 1 ? MISSION_DATA.communicationDelay : prev - 1));
    }, 1000);
    return () => clearInterval(commIntervalRef.current);
  }, []);

  // Mission elapsed time counter
  useEffect(() => {
    elapsedIntervalRef.current = setInterval(() => {
      setMissionElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(elapsedIntervalRef.current);
  }, []);

  const updateMetric = useCallback((key, value) => {
    setCurrentMetrics(prev => ({ ...prev, [key]: value }));
  }, []);

  const logDataPoint = useCallback(() => {
    setLastSync(new Date().toLocaleTimeString());
  }, []);

  const toggleBodyPart = useCallback((part) => {
    if (selectedBodyPart === part && isDrawerOpen) {
      setIsDrawerOpen(false);
      setTimeout(() => setSelectedBodyPart(null), 300);
    } else {
      setSelectedBodyPart(part);
      setIsDrawerOpen(true);
    }
  }, [selectedBodyPart, isDrawerOpen]);

  const closeDrawer = useCallback(() => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedBodyPart(null), 300);
  }, []);

  const toggleChecklist = useCallback((id) => {
    setChecklistItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, completed: !item.completed, timestamp: !item.completed ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null }
          : item
      )
    );
  }, []);

  const dismissAlert = useCallback((alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  }, []);

  const formatCommDelay = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s.toString().padStart(2, '0')}s`;
  };

  const formatElapsed = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hrs = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hrs, mins, secs };
  };

  return {
    currentMetrics,
    alerts,
    checklistItems,
    streakData,
    selectedBodyPart,
    isDrawerOpen,
    activeTab,
    commDelay,
    missionElapsed,
    lastSync,
    crewHealthIndex,
    updateMetric,
    logDataPoint,
    toggleBodyPart,
    closeDrawer,
    setActiveTab,
    toggleChecklist,
    dismissAlert,
    formatCommDelay,
    formatElapsed,
  };
}
