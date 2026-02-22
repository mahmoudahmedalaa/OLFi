# BuyOut State Management & Data Flow Architecture

BuyOut uses a hybrid state management approach. We separate **Client UI State** (user inputs, active tabs, dark mode toggle) from **Server/Asynchronous State** (fetched user profiles, active loan offers, bank integrations).

## 1. Client State: Zustand

We use `zustand` for all global, synchronous UI state because it is incredibly lightweight, avoids React Context re-render hell, and has a simple, hook-based API.

### Store Architecture

Our Zustand stores are slice-based. Instead of one massive `useStore`, we logically group them:

*   **`useUIStore.ts`**: Manages pure visual state (e.g., `isSidebarOpen`, `theme: 'light' | 'dark'`, `activeModal`).
*   **`useApplicationStore.ts`**: The most critical store. It holds the intermediate state of the user's refinance application *before* it is submitted to the backend.
    *   Holds Arrays of `currentDebts` (Personal Loans, Auto Loans, Credit Cards).
    *   Holds the user's `monthlySalary` and `selectedTenure` (from the slider!).
    *   Computes derived state client-side (e.g., total debt pool) to provide immediate feedback to the UI without waiting for network requests.

### Zustand Best Practices in BuyOut

1.  **Select strictly what you need:** Do not extract the entire store. This prevents unnecessary re-renders.
    *   *Good:* `const currentDebts = useApplicationStore((state) => state.currentDebts);`
    *   *Bad:* `const store = useApplicationStore();`
2.  **Actions are embedded in the store:** Always define state-mutating functions directly within the `create` block.
    ```typescript
    interface FormState {
      salary: number;
      setSalary: (amount: number) => void;
    }
    const useFormStore = create<FormState>((set) => ({
      salary: 0,
      setSalary: (salary) => set({ salary }),
    }))
    ```

---

## 2. Server State: Supabase Hooks & Context

For data that lives in the database (User Profiles, Bank Offers, Application History), we rely on Supabase.

### Authentication Flow (Supabase Auth)

1.  User enters email/OTP.
2.  `supabase.auth.signInWithOtp` is called.
3.  We use a top-level `AuthProvider` (React Context) that listens to `supabase.auth.onAuthStateChange`.
4.  If a session exists, the router automatically pushes the user to `(tabs)/home`. If no session, they are confined to `(auth)`.
5.  *Never store the JWT manually.* Supabase handles secure token rotation via `@react-native-async-storage/async-storage`.

### Data Fetching Strategy

We do not currently use `react-query` or `swr` (though it is a future roadmap item for caching). Currently, we fetch via standard `useEffect` blocks or inside `getServerSideProps` / direct async functions in Expo Router pages.

**The Golden Rule for Data Fetching:**
1.  **Component Mounts:** Display a skeleton loader (from `gluestack-ui`).
2.  **Fetch Data:** Call Supabase (e.g., `supabase.from('offers').select('*')`).
3.  **Hydrate Local State:** Either store the result in local component state `useState` (if it's a one-off screen) or push it into a Zustand store (if it needs to be accessed across multiple tabs).
4.  **Render Data:** Replace skeleton with actual content.

### Mutation Strategy (Writing to the DB)

When a user submits an application (`apply-offer.tsx`):
1.  We collect data from `useApplicationStore`.
2.  We perform client-side logic checks (e.g., Is salary > 0? Are debts listed?).
3.  We call a Supabase **Edge Function** (not direct SQL `insert`) to handle the complex, secure logic of processing the application and generating the final numbers.
4.  Upon success (200 OK), we clear the `useApplicationStore` via a `resetStore` action, and navigate the user to a success screen.
