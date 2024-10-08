import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;
    const backendUrl = "https://ecommerce-backend-67zk.onrender.com";
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {
        const product = products.find(product => product._id === itemId);
        if (product?.category === 'Clothing' && !size) {
            toast.error('Select Product Size');
            return;
        }

        const updatedCart = { ...cartItems };

        if (updatedCart[itemId]) {
            if (updatedCart[itemId][size]) {
                updatedCart[itemId][size] += 1;
            } else {
                updatedCart[itemId][size] = 1;
            }
        } else {
            updatedCart[itemId] = { [size]: 1 };
        }

        setCartItems(updatedCart);

    if (token) {
        try {
            await axios.post(`${backendUrl}/api/cart/add`, { itemId, size }, { headers: { token } });
            toast.success('Product added to cart'); // Success notification
        } catch (error) {
            console.error(error);
            toast.error('Failed to add item to cart.'); // Error notification
        }
    } else {
        toast.success('Product added to cart'); // Notify user if no token (local cart update)
    }
    };

    const getCartCount = () => {
        return Object.values(cartItems).reduce((total, sizes) => 
            total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0), 0
        );
    };

    const updateQuantity = async (itemId, size, quantity) => {
        const updatedCart = { ...cartItems, [itemId]: { ...cartItems[itemId], [size]: quantity } };

        setCartItems(updatedCart);

        if (token) {
            try {
                await axios.post(`${backendUrl}/api/cart/update`, { itemId, size, quantity }, { headers: { token } });
            } catch (error) {
                console.error(error);
                toast.error('Failed to update item quantity.');
            }
        }
    };

    const getCartAmount = () => {
        return Object.entries(cartItems).reduce((totalAmount, [itemId, sizes]) => {
            const item = products.find(product => product._id === itemId);
            return totalAmount + Object.entries(sizes).reduce((amount, [size, qty]) => {
                return amount + (item ? item.price * qty : 0);
            }, 0);
        }, 0);
    };

    const getProductsData = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/product/list`);
            if (response.data.success) {
                setProducts(response.data.products.reverse());
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch products.');
        }
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(`${backendUrl}/api/cart/get`, {}, { headers: { token } });
            if (response.data.success) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch cart data.');
        }
    };

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(() => {
        const localToken = localStorage.getItem('token');
        if (localToken && !token) {
            setToken(localToken);
        }
        if (token) {
            getUserCart(token);
        }
    }, [token]);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmount, navigate, backendUrl,
        setToken, token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
