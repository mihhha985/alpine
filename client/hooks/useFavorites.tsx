"use client";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	useState,
	type Dispatch,
	type ReactNode,
} from "react";
import type { Product } from "@/entities/domain";

export type FavoritesState = {
	items: Product[];
};

export type FavoritesAction =
	| { type: "TOGGLE"; payload: { product: Product } }
	| { type: "REMOVE"; payload: { documentId: string } }
	| { type: "CLEAR" }
	| { type: "HYDRATE"; payload: FavoritesState };

const STORAGE_KEY = "alpine.favorites.v1";
const initialState: FavoritesState = { items: [] };

function favoritesReducer(
	state: FavoritesState,
	action: FavoritesAction,
): FavoritesState {
	switch (action.type) {
		case "TOGGLE": {
			const { product } = action.payload;
			const exists = state.items.some(
				(item) => item.documentId === product.documentId,
			);
			if (exists) {
				return {
					items: state.items.filter(
						(item) => item.documentId !== product.documentId,
					),
				};
			}
			return { items: [...state.items, product] };
		}
		case "REMOVE": {
			return {
				items: state.items.filter(
					(item) => item.documentId !== action.payload.documentId,
				),
			};
		}
		case "CLEAR":
			return initialState;
		case "HYDRATE":
			return action.payload;
		default:
			return state;
	}
}

type FavoritesContextValue = {
	state: FavoritesState;
	dispatch: Dispatch<FavoritesAction>;
	totalQuantity: number;
	isFavorite: (documentId: string) => boolean;
	toggle: (product: Product) => void;
	remove: (documentId: string) => void;
	clear: () => void;
	isOpen: boolean;
	open: () => void;
	close: () => void;
	setOpen: (open: boolean) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(favoritesReducer, initialState);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as FavoritesState;
			if (parsed && Array.isArray(parsed.items)) {
				dispatch({ type: "HYDRATE", payload: parsed });
			}
		} catch {
			// ignore corrupted storage
		}
	}, []);

	useEffect(() => {
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {
			// ignore quota / privacy mode errors
		}
	}, [state]);

	const isFavorite = useCallback(
		(documentId: string) =>
			state.items.some((item) => item.documentId === documentId),
		[state.items],
	);

	const toggle = useCallback((product: Product) => {
		dispatch({ type: "TOGGLE", payload: { product } });
	}, []);

	const remove = useCallback((documentId: string) => {
		dispatch({ type: "REMOVE", payload: { documentId } });
	}, []);

	const clear = useCallback(() => {
		dispatch({ type: "CLEAR" });
	}, []);

	const open = useCallback(() => setIsOpen(true), []);
	const close = useCallback(() => setIsOpen(false), []);

	const value = useMemo<FavoritesContextValue>(
		() => ({
			state,
			dispatch,
			totalQuantity: state.items.length,
			isFavorite,
			toggle,
			remove,
			clear,
			isOpen,
			open,
			close,
			setOpen: setIsOpen,
		}),
		[state, isFavorite, toggle, remove, clear, isOpen, open, close],
	);

	return (
		<FavoritesContext.Provider value={value}>
			{children}
		</FavoritesContext.Provider>
	);
}

export function useFavorites(): FavoritesContextValue {
	const ctx = useContext(FavoritesContext);
	if (!ctx) {
		throw new Error(
			"useFavorites должен использоваться внутри <FavoritesProvider>",
		);
	}
	return ctx;
}
