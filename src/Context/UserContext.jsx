// UserContext.js
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import api from "../api/axios";
import { Beaker } from "lucide-react";
import { ENDPOINTS } from "../api/endpoints";
const UserContext = createContext();

const initialState = {
  user: null,
  cart: [],
  wishlist: [],
  loading: true,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      if (!action.payload) {
        return {
          ...state,
          user: null,
          cart: [],
          wishlist: [],
        };
      }

      return {
        ...state,
        user: action.payload,
      };

    case "SET_CART":
      return {
        ...state,
        cart: action.payload,
      };

    case "SET_WISHLIST":
      return {
        ...state,
        wishlist: Array.isArray(action.payload) ? action.payload : [],
      };
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const [cart,setCart] = useState([])

  const loadCart = async () => {
    try {
      const res = await api.get(ENDPOINTS.CART);

      const items = res.data.cart?.items || [];

      dispatch({
        type: "SET_CART",
        payload: items,
      });

      return items;
    } catch (error) {
      dispatch({ type: "SET_CART", payload: [] });
      return [];
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await api.get(ENDPOINTS.WISHLIST);
      const items = Array.isArray(res.data) ? res.data : [];

      dispatch({
        type: "SET_WISHLIST",
        payload: items,
      });

      return items;
    } catch (error) {
      dispatch({ type: "SET_WISHLIST", payload: [] });
      return [];
    }
  };
  const hydrateUserData = async () => {
    dispatch({ type: "SET_LOADING", payload: true });

    await Promise.all([loadCart(), loadWishlist()]);

    dispatch({ type: "SET_LOADING", payload: false });
  };

  useEffect(() => {
    const access = localStorage.getItem("access");

    if (access) {
      hydrateUserData();
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = async (JWTResponse) => {
    const { access, refresh, user } = JWTResponse;
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    dispatch({ type: "SET_USER", payload: user });
    await hydrateUserData();
    // localStorage.setItem("activeUser", JSON.stringify(userData));
  };

  const logout = () => {
    dispatch({ type: "SET_USER", payload: null });
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  const syncUserData = async (cart, wishlist) => {
    if (state.user?.id) {
      const updatedUser = { ...state.user, cart, wishlist };
      await axios.patch(
        `https://gogrub-api-mock.onrender.com/users/${state.user.id}`,
        updatedUser
      );
      localStorage.setItem("activeUser", JSON.stringify(updatedUser));
      dispatch({ type: "SET_USER", payload: updatedUser });
    }
  };

  const addToCart = async (product, quantity) => {
    try {
      const res = await api.post(ENDPOINTS.CART, {
        product_id: product.id,
        quantity: quantity,
      });
      const fullCart = await api.get(ENDPOINTS.CART);
      dispatch({ type: "SET_CART", payload: fullCart.data.cart.items });
      syncUserData(fullCart.data.cart.items, state.wishlist);
    } catch (error) {
      console.error("Add failed:", error.response?.data || error.message);
    }
  };

  const updateQuantity = async (item, type) => {
    console.log(item.id);
    const newQty =
      type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    const updatedCart = state.cart.map((cartItem) =>
      cartItem.id === item.id ? { ...cartItem, quantity: newQty } : cartItem
    );

    dispatch({
      type: "SET_CART",
      payload: updatedCart,
    });

    try {
      await api.put(ENDPOINTS.QUANTITY, {
        cart_item_id: item.id,
        quantity: newQty,
      });
    } catch (error) {
      console.error("Quantity update failed", error);
      loadCart();
    }
  };

  const removeFromCart = async (item) => {  
    const updatedCart = state.cart.filter(
      (cartItem) => cartItem.id !== item.id
    );

    dispatch({
      type: "SET_CART",
      payload: updatedCart,
    });

    try {
      await api.delete(ENDPOINTS.DELETE_CART, {
        data: { cart_item_id: item.id },
      });
    } catch (error) {
      console.error("Delete failed", error);
      loadCart();
    }
  };

  const addToWishlist = async (product) => {
    try {
      let res = await api.post(ENDPOINTS.WISHLIST, {
        product_id: product.id,
      });
      const fullWishlist = await api.get(ENDPOINTS.WISHLIST);

      dispatch({
        type: "SET_WISHLIST",
        payload: Array.isArray(fullWishlist.data) ? fullWishlist.data : [],
      });
    } catch (error) {
      console.error("Add Wishlist Failed ", error);
    }
  };

  const removeFromWishlist = async (product) => {
    try {
      await api.delete(ENDPOINTS.DEL_WISHLIST, {
        data: { item_id: product.id },
      });
    } catch (error) {
      console.error("Not removed");
    }
    let res = await api.get(ENDPOINTS.WISHLIST);
    dispatch({ type: "SET_WISHLIST", payload: res.data });
  };

  const clearCart =async ()=>{
    try{

      const res = await api.post(ENDPOINTS.CLEAR_CART)
      const emptyItems = res.data.cart?.items || [];
      dispatch({type:"SET_CART", payload:emptyItems})
      syncUserData(emptyItems, state.wishlist);
      return true
    }catch(error){

      console.error(error)
    }

  }

  return (
    <UserContext.Provider
      value={{
        state,
        dispatch,
        login,
        logout,
        // cart,
        addToCart,
        clearCart,
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
