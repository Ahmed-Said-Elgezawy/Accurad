import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.reducer';


export const selectCartState = createFeatureSelector<CartState>('cart');


export const selectCartItems = createSelector(selectCartState, (s) => s.items);


export const selectCartTotal = createSelector(selectCartItems, (items) =>
items.reduce((sum, i) => sum + i.subtotal, 0)
);

// Basic Level Questions:
 
// 1.What is React and how does it work?
// 2.What are the differences between functional and class components?
// 3.What are props and state? How are they different?
// 4.What is JSX, and why is it used in React?
// 5. How do you create a simple React component?
// 6.What is the Virtual DOM, and why is it important?
// 7.What is the purpose of the key prop in React lists?
// 8. How do you handle events in React?
// 9.What are default props in React?
// 10.What is conditional rendering in React?

// Moderate Level Questions:
// 11. What are React Hooks? Can you explain useState and useEffect with examples?
// 12. What is the difference between controlled and uncontrolled components?
// 13. What is React Router, and how does client-side routing work?
// 14. What is the Context API, and when should you use it instead of Redux?
// 15. What is prop drilling, and how can it be avoided?
// 16. What is React.memo, and how does it help with performance optimization?
// 17. What is the difference between useMemo and useCallback?
// 18. What is a Higher-Order Component (HOC), and how is it used?
// 19. How does React handle forms, and what are controlled inputs?

// Advanced Level Questions:
// 20. How does React handle re-renders, and how can you optimize unnecessary renders?
// 21. What is reconciliation in React?
// 22. How does React’s diffing algorithm work?
// 23. What is React.lazy and Suspense? How does lazy loading work in React?
// 24. What are error boundaries, and how do they work?
// 25. How do you handle authentication and protected routes in React?
// 26. What are render props, and how are they different from HOCs?
// 27. How does server-side rendering (SSR) differ from client-side rendering (CSR) in React?
// 28. What are React Fiber and Concurrent Mode?
// 29. How do you test React components? What are the commonly used testing libraries?