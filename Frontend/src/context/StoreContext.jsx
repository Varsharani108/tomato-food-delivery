import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});

    const url = "http://localhost:5000";

    const [token, setToken] = useState("");

    const [food_list, setFoodList] = useState([]);


    // ================= ADD TO CART =================

    const addToCart = (itemId) => {

        if (!cartItems[itemId]) {

            setCartItems((prevCartItems) => ({
                ...prevCartItems,
                [itemId]: 1,
            }));

        } else {

            setCartItems((prev) => ({
                ...prev,
                [itemId]: prev[itemId] + 1,
            }));

        }
    };


    // ================= REMOVE FROM CART =================

    const removeFromCart = (itemId) => {

        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1
        }));

    };


    // ================= TOTAL CART AMOUNT =================

    const getTotalCartAmount = () => {

        let totalAmount = 0;

        for (const item in cartItems) {

            if (cartItems[item] > 0) {

                let itemInfo = food_list.find(
                    (product) => product._id === item
                );

                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
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

                console.log("Error fetching food list");

            }

        } catch (error) {

            console.log("Error:", error);

        }
    };


    // ================= LOAD DATA =================

    useEffect(() => {

        async function loadData() {

            await fetchFoodList();

            if (localStorage.getItem("token")) {

                setToken(
                    localStorage.getItem("token")
                );

            }
        }

        loadData();

    }, []);


    // ================= CONTEXT VALUE =================

    const contextValue = {

        food_list,

        cartItems,
        setCartItems,

        addToCart,
        removeFromCart,
        getTotalCartAmount,

        url,

        token,
        setToken

    };


    return (

        <StoreContext.Provider value={contextValue}>

            {props.children}

        </StoreContext.Provider>

    );
};

export default StoreContextProvider;