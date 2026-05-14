"use client";
import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useReducer,
	type Dispatch,
	type ReactNode,
} from "react";
import type {
	CartItem,
	Color,
	ProductBySlug,
	Size,
} from "@/entities/domain";
import { makeCartItemId } from "@/entities/domain";

export type CartState = {
	items: CartItem[];
};

export type CartAction =
	| {
			type: "ADD";
			payload: {
				product: ProductBySlug;
				size: Size | null;
				color: Color | null;
				quantity: number;
			};
	  }
	| { type: "INCREMENT"; payload: { id: string } }
	| { type: "DECREMENT"; payload: { id: string } }
	| { type: "REMOVE"; payload: { id: string } }
	| { type: "CLEAR" }
	| { type: "HYDRATE"; payload: CartState };

const STORAGE_KEY = "alpine.cart.v1";
const initialState: CartState = { items: [] };

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case "ADD": {
			const { product, size, color, quantity } = action.payload;
			if (quantity <= 0) return state;

			const id = makeCartItemId(product.documentId, size, color);
			const existing = state.items.find((item) => item.id === id);

			if (existing) {
				return {
					items: state.items.map((item) =>
						item.id === id
							? { ...item, quantity: item.quantity + quantity }
							: item,
					),
				};
			}

			const newItem: CartItem = {
				id,
				documentId: product.documentId,
				Title: product.Title,
				Price: product.Price,
				MainImg: product.MainImg,
				brand: product.brand,
				Badge: product.Badge,
				size,
				color,
				quantity,
			};
			return { items: [...state.items, newItem] };
		}
		case "INCREMENT": {
			return {
				items: state.items.map((item) =>
					item.id === action.payload.id
						? { ...item, quantity: item.quantity + 1 }
						: item,
				),
			};
		}
		case "DECREMENT": {
			return {
				items: state.items
					.map((item) =>
						item.id === action.payload.id
							? { ...item, quantity: item.quantity - 1 }
							: item,
					)
					.filter((item) => item.quantity > 0),
			};
		}
		case "REMOVE": {
			return {
				items: state.items.filter((item) => item.id !== action.payload.id),
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

type CartContextValue = {
	state: CartState;
	dispatch: Dispatch<CartAction>;
	totalQuantity: number;
	totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function parsePrice(raw: unknown): number {
	if (typeof raw === "number") {
		return Number.isFinite(raw) ? raw : 0;
	}
	if (typeof raw === "string") {
		const normalized = raw.replace(/[^\d.,-]/g, "").replace(",", ".");
		const value = Number(normalized);
		return Number.isFinite(value) ? value : 0;
	}
	return 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, initialState);

	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as CartState;
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

	const value = useMemo<CartContextValue>(() => {
		const totalQuantity = state.items.reduce(
			(sum, item) => sum + item.quantity,
			0,
		);
		const totalPrice = state.items.reduce(
			(sum, item) => sum + parsePrice(item.Price) * item.quantity,
			0,
		);
		return { state, dispatch, totalQuantity, totalPrice };
	}, [state]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
	const ctx = useContext(CartContext);
	if (!ctx) {
		throw new Error("useCart должен использоваться внутри <CartProvider>");
	}
	return ctx;
}
