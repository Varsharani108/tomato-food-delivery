import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [food_list, setFoodList] = useState([]);
    const [token, setToken] = useState("");
    const [user, setUser] = useState(null);

    const url = "http://localhost:5000";


    // ================= ADD TO CART =================

    const addToCart = async (itemId) => {

        // Update frontend cart
        if (!cartItems[itemId]) {

            setCartItems((prev) => ({
                ...prev,
                [itemId]: 1
            }));

        } else {

            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1
            }));

        }

        // Update database
        if (token) {

            try {

                const response = await axios.post(
                    url + "/api/cart/add",
                    {
                        itemId: itemId
                    },
                    {
                        headers: {
                            token: token
                        }
                    }
                );

                console.log(response.data);

            } catch (error) {

                console.log("Add to cart error:", error);

            }
        }
    };


    // ================= REMOVE FROM CART =================

    const removeFromCart = async (itemId) => {

        // Update frontend cart
        setCartItems((prev) => {

            const updatedCart = {
                ...prev,
                [itemId]: prev[itemId] - 1
            };

            // Remove item when quantity becomes 0
            if (updatedCart[itemId] <= 0) {
                delete updatedCart[itemId];
            }

            return updatedCart;
        });


        // Update database
        if (token) {

            try {

                const response = await axios.post(
                    url + "/api/cart/remove",
                    {
                        itemId: itemId
                    },
                    {
                        headers: {
                            token: token
                        }
                    }
                );

                console.log(response.data);

            } catch (error) {

                console.log("Remove from cart error:", error);

            }
        }
    };


    // ================= GET TOTAL CART AMOUNT =================

    const getTotalCartAmount = () => {

        let totalAmount = 0;

        for (const item in cartItems) {

            if (cartItems[item] > 0) {

                const itemInfo = food_list.find(
                    (product) => product._id === item
                );

                if (itemInfo) {

                    totalAmount +=
                        itemInfo.price * cartItems[item];

                }
            }
        }

        return totalAmount;
    };


    // ================= FETCH FOOD LIST =================

    const fetchFoodList = async () => {

        try {

            const response = await axios.get(
                url + "/api/food/list"
            );

            if (response.data.success) {

                setFoodList(response.data.data);

            } else {

                console.log(
                    "Error fetching food list"
                );

            }

        } catch (error) {

            console.log(
                "Food list error:",
                error
            );

        }
    };


    // ================= LOAD CART DATA =================

    const loadCartData = async (token) => {

        try {

            const response = await axios.post(
                url + "/api/cart/get",
                {},
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {

                setCartItems(
                    response.data.cartData
                );

            } else {

                console.log(
                    response.data.message
                );

            }

        } catch (error) {

            console.log(
                "Load cart error:",
                error
            );

        }
    };


    // ================= LOAD USER DATA =================

    const loadUserData = async (token) => {

        try {

            const response = await axios.get(
                url + "/api/user/profile",
                {
                    headers: {
                        token: token
                    }
                }
            );

            if (response.data.success) {

                setUser(response.data);

            } else {

                console.log(
                    response.data.message
                );

            }

        } catch (error) {

            console.log(
                "Load user error:",
                error
            );

        }
    };


    // ================= LOAD DATA =================

    useEffect(() => {

        const loadData = async () => {

            // Fetch all food from MongoDB
            await fetchFoodList();

            // Get token from localStorage
            const savedToken =
                localStorage.getItem("token");

            if (savedToken) {

                setToken(savedToken);

                // Get cart from MongoDB
                await loadCartData(savedToken);

                // Get user profile from MongoDB
                await loadUserData(savedToken);

            }

        };

        loadData();

    }, []);


    // ================= CONTEXT VALUE =================

    const contextValue = {

        // Food
        food_list,

        // Cart
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,

        // Backend
        url,

        // Authentication
        token,
        setToken,
        user,

        // Load cart
        loadCartData,
        loadUserData

    };


    return (

        <StoreContext.Provider
            value={contextValue}
        >

            {props.children}

        </StoreContext.Provider>

    );

};

export default StoreContextProvider;