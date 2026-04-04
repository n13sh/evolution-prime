'use client';
import { create } from 'zustand';

interface LogEntry {
  exerciseId: number;
  exerciseName: string;
  setNumber: number;
  reps: number;
  weightKg: number;
  rir?: number;
}

interface WorkoutState {
  activeSessionId: number | null;
  planId: number | null;
  dayIndex: number | null;
  logs: LogEntry[];
  timerState: 'idle' | 'work' | 'rest';
  timerSeconds: number;
  currentExerciseIndex: number;
  currentSetNumber: number;
  startedAt: number | null;

  startSession: (sessionId: number, planId?: number, dayIndex?: number) => void;
  logSet: (entry: LogEntry) => void;
  startRestTimer: (seconds: number) => void;
  tickTimer: () => void;
  stopTimer: () => void;
  nextExercise: () => void;
  completeSession: () => void;
  resetSession: () => void;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeSessionId: null,
  planId: null,
  dayIndex: null,
  logs: [],
  timerState: 'idle',
  timerSeconds: 0,
  currentExerciseIndex: 0,
  currentSetNumber: 1,
  startedAt: null,

  startSession: (sessionId, planId, dayIndex) =>
    set({
      activeSessionId: sessionId,
      planId: planId || null,
      dayIndex: dayIndex ?? null,
      logs: [],
      timerState: 'idle',
      timerSeconds: 0,
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      startedAt: Date.now(),
    }),

  logSet: (entry) =>
    set(state => ({
      logs: [...state.logs, entry],
      currentSetNumber: state.currentSetNumber + 1,
    })),

  startRestTimer: (seconds) =>
    set({ timerState: 'rest', timerSeconds: seconds }),

  tickTimer: () => {
    const { timerSeconds } = get();
    if (timerSeconds <= 0) {
      set({ timerState: 'idle', timerSeconds: 0 });
    } else {
      set({ timerSeconds: timerSeconds - 1 });
    }
  },

  stopTimer: () => set({ timerState: 'idle', timerSeconds: 0 }),

  nextExercise: () =>
    set(state => ({
      currentExerciseIndex: state.currentExerciseIndex + 1,
      currentSetNumber: 1,
    })),

  completeSession: () =>
    set({
      timerState: 'idle',
      timerSeconds: 0,
    }),

  resetSession: () =>
    set({
      activeSessionId: null,
      planId: null,
      dayIndex: null,
      logs: [],
      timerState: 'idle',
      timerSeconds: 0,
      currentExerciseIndex: 0,
      currentSetNumber: 1,
      startedAt: null,
    }),
}));
