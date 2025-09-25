// UserContext.js
import { createContext, useContext, useEffect, useReducer } from "react";
import axios from "axios";

const UserContext = createContext();

const initialState = {
  user: null,
  cart: [],
  wishlist: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      if (!action.payload) {
        // clear everything when user is null
        return { ...state, user: null, cart: [], wishlist: [] };
      }
      return {
        ...state,
        user: action.payload,
        cart: Array.isArray(action.payload.cart)
          ? action.payload.cart
          : state.cart,
        wishlist: Array.isArray(action.payload.wishlist)
          ? action.payload.wishlist
          : state.wishlist,
      };
    case "SET_CART":
      return { ...state, cart: action.payload };
    case "SET_WISHLIST":
      return { ...state, wishlist: action.payload };
    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem("activeUser");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Fetch latest user data from backend
      axios
        .get(`https://gogrub-api-mock.onrender.com/users/${user.id}`)
        .then((res) => {
          dispatch({ type: "SET_USER", payload: res.data });
        })
        .catch(() => {
          dispatch({ type: "SET_USER", payload: null });
        });
    }
  }, []);

  const login = (userData) => {
    dispatch({ type: "SET_USER", payload: userData }); // includes cart & wishlist
    localStorage.setItem("activeUser", JSON.stringify(userData));
  };

  const logout = () => {
    dispatch({ type: "SET_USER", payload: null });
    localStorage.removeItem("activeUser");
  };

  const syncUserData = async (cart, wishlist) => {
    if (state.user?.id) {
      const updatedUser = { ...state.user, cart, wishlist };
      await axios.patch(
        `https://gogrub-api-mock.onrender.com/users/${state.user.id}`,
        updatedUser
      );
      localStorage.setItem("activeUser", JSON.stringify(updatedUser));
      dispatch({ type: "SET_CART", payload: cart });
      dispatch({ type: "SET_WISHLIST", payload: wishlist });
    }
  };

  const addToCart = (product) => {
    const existing = state.cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existing) {
      updatedCart = state.cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...state.cart,
        { ...product, quantity: product.quantity || 1 },
      ];
    }

    dispatch({ type: "SET_CART", payload: updatedCart });
    syncUserData(updatedCart, state.wishlist);
  };

  const updateQuantity = (id, type) => {
    const updatedCart = state.cart.map((item) => {
      if (item.id === id) {
        const newQty =
          type === "inc" ? item.quantity + 1 : Math.max(item.quantity - 1, 1);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    dispatch({ type: "SET_CART", payload: updatedCart });
    syncUserData(updatedCart, state.wishlist);
  };

  const removeFromCart = (id) => {
    const updatedCart = state.cart.filter((item) => item.id !== id);
    dispatch({ type: "SET_CART", payload: updatedCart });
    syncUserData(updatedCart, state.wishlist);
  };

  const addToWishlist = (product) => {
    const exists = state.wishlist.find((item) => item.id === product.id);
    if (exists) return;
    const updatedWishlist = [...state.wishlist, product];
    dispatch({ type: "SET_WISHLIST", payload: updatedWishlist });
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    syncUserData(state.cart, updatedWishlist);
  };

  const removeFromWishlist = (id) => {
    const updatedWishlist = state.wishlist.filter((item) => item.id !== id);
    dispatch({ type: "SET_WISHLIST", payload: updatedWishlist });
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    syncUserData(state.cart, updatedWishlist);
  };

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        addToCart,
        updateQuantity,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
