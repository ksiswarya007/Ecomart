import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Loading = () => {
    const { navigate: contextNavigate } = useAppContext();
    const navigate = useNavigate(); // fallback if context doesn't have navigate
    const { search } = useParams();

    // If you're using URL query params (like ?next=my-orders), you should use useLocation
    const searchParams = new URLSearchParams(window.location.search);
    const nextUrl = searchParams.get('next');

    useEffect(() => {
        if (nextUrl) {
            setTimeout(() => {
                (contextNavigate || navigate)(`/${nextUrl}`);
            }, 5000);
        }
    }, [nextUrl]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
        </div>
    );
};

export default Loading;
