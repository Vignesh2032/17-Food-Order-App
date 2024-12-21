import { createContext, useReducer, useState } from "react";

const CartContext = createContext({
    items: [],
    addItem: (item) => { },
    removeItem: (id) => { },
    clearItem: () => { }
});

function cartReducer(state, action) {
    if (action.type === 'ADD_ITEM') {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );

        const updatedItems = [...state.items];
        if (existingCartItemIndex > -1) {
            const existingItem = state.items[existingCartItemIndex];
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1
            }
            updatedItems[existingCartItemIndex] = updatedItem;
        }
        else {
            updatedItems.push({ ...action.item, quantity: 1 });
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === 'REMOVE_ITEM') {
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );

        const updatedItems = [...state.items];
        const existingCartItem = state.items[existingCartItemIndex];

        if (existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        }
        else {
            const updatedItem = { ...existingCartItem, quantity: existingCartItem.quantity - 1 }
            updatedItems[existingCartItemIndex] = updatedItem;
        }

        return { ...state, items: updatedItems };
    }

    if (action.type === 'CLEAR_CART') {
        return { ...state, items: [] };
    }

    return state;
}
export function CartContextProvider({ children }) {
    const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });

    function addItem(item) {
        dispatchCartAction({ type: 'ADD_ITEM', item: item });
    }

    function removeItem(id) {
        dispatchCartAction({ type: 'REMOVE_ITEM', item: { id: id } });
    }

    function clearItem(){
        dispatchCartAction({type: 'CLEAR_CART'})
    }

    const cartContext = {
        items: cart.items,
        addItem: addItem,
        removeItem: removeItem,
        clearItem: clearItem
    }

    return (
        <CartContext.Provider value={cartContext}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContext;