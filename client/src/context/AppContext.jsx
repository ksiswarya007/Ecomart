import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from 'axios'

axios.defaults.withCredentials=true
axios.defaults.baseURL=import.meta.env.VITE_BACKEND_URL

export const AppContext=createContext()

export const AppContextProvider=({children})=>{

    const currency=import.meta.env.VITE_CURRENCY;
 

    const navigate=useNavigate();
    const [ user,setUser]=useState(null)
    const [isSeller,setIsSeller]=useState(false)
    const [showUserLogin,setShowUserLogin]=useState(true)
    const [products,setProducts]=useState([])
    
    const [cartItems,setCartItems]=useState({})
    const [searchQuery,setSearchQuery]=useState("")

    //fetch seller status
    const fetchSeller=async()=>{
        try{
            const {data}=await axios.get('/api/seller/is-auth')
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        }catch(e){
            console.error(e);
            toast.error(e.message || "Something went wrong")
        }
    }


    //fetch user Authstatus,user data and cart items
    const fetchUser=async()=>{
        try{
            const {data}=await axios.get('/api/user/is-auth')
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)

            }
        }catch(e){
            setUser(null);
        }
    }


    //fetch all products
    const fetchProducts=async ()=>{
        try{
            const {data}=await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products);
            }
            else{
                toast.error(data.message || "Something went wrong")
            }
        }catch(e){
            console.error(e);
            toast.error(e.message || "Something went wrong")
        }
    }

    console.log(products);
    //add product to cart
    const addToCart=(itemId)=>{
         let cartData=structuredClone(cartItems);
          
         if(cartData[itemId]){
            cartData[itemId]+=1;
         }else{
            cartData[itemId]=1;
         }
         setCartItems(cartData); 
         toast.success("Added to cart")
    }

    ///update cart item quantity
    const updateCartItem=(itemId,quantity)=>{
        let cartData=structuredClone(cartItems);
        cartData[itemId]=quantity;
        setCartItems(cartData)
        toast.success("Cart Updated")
    }

    //remove product from cart
    const removeFromCart=(itemId)=>{
        let cartData=structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]-=1;
            if(cartData[itemId]===0){
                delete cartData[itemId];
            }
        }
        toast.success("Removed from cart")
        setCartItems(cartData)
    }
    //get cart item count
    const getCartCount=()=>{
        let totalCount=0;
        for(const item in cartItems){
            totalCount+=cartItems[item];
        }
        return totalCount;
    }

    //get cart total amount
    const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
        let itemInfo = products.find((product) => product._id == items);
        if (itemInfo && cartItems[items] > 0) {
            totalAmount += itemInfo.offerPrice * cartItems[items];
        }
    }
    return Math.floor(totalAmount * 100) / 100;
}


    useEffect(()=>{
        fetchUser()
        fetchProducts()
        fetchSeller()
    },[])

    //update cart items in user data
    useEffect(()=>{
        const updateCart=async()=>{
            try{
                console.log("🛒 Cart sent to backend:", cartItems); 
                const {data}=await axios.post('/api/cart/update',{
                    userId:user._id,
                    cartItems})
                if(!data.success){
                    toast.error(data.message )
                } 
            }catch(e){
                toast.error(e.message )
            }
        }
        if(user){
            updateCart();
        }
    },[cartItems])
    const value={navigate,user,setUser,isSeller,setIsSeller,showUserLogin,setShowUserLogin,products,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,axios,fetchProducts,setCartItems}


    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}                                                                                             

export const useAppContext=()=>{
    return useContext(AppContext)
}
