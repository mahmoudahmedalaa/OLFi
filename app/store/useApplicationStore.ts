import { create } from 'zustand';

export interface DebtItem {
    id: string;
    type: 'personal_loan' | 'auto_loan';
    balanceFils: number;
    emiFils: number;
    tenureRemaining?: number;
}

interface ApplicationState {
    currentDebts: DebtItem[];
    monthlySalary: number;
    selectedTenure: number;

    addDebt: (debt: DebtItem) => void;
    removeDebt: (id: string) => void;
    setMonthlySalary: (amount: number) => void;
    setSelectedTenure: (tenure: number) => void;
    resetStore: () => void;
}

const initialState = {
    currentDebts: [],
    monthlySalary: 0,
    selectedTenure: 48, // Default 48 months
};

export const useApplicationStore = create<ApplicationState>((set) => ({
    ...initialState,

    addDebt: (debt) => set((state) => ({ currentDebts: [...state.currentDebts, debt] })),
    removeDebt: (id) => set((state) => ({ currentDebts: state.currentDebts.filter(d => d.id !== id) })),
    setMonthlySalary: (salary) => set({ monthlySalary: salary }),
    setSelectedTenure: (tenure) => set({ selectedTenure: tenure }),
    resetStore: () => set(initialState),
}));
