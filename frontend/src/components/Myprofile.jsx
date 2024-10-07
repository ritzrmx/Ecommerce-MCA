import React, { useEffect, useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const MyProfile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const { token } = useContext(ShopContext);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const response = await fetch('/api/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Using the token here
                }
            });
            const data = await response.json();
            if (data.success) {
                setUserDetails(data.user);
            } else {
                console.error(data.message);
                setUserDetails(null); // Reset to null on error
            }
        };

        if (token) {
            fetchUserDetails();
        } else {
            console.error("No token found");
        }
    }, [token]);

    return (
        <div className="my-profile">
            {userDetails ? (
                <div>
                    <h1>My Profile</h1>
                    <p>Name: {userDetails.name}</p>
                    <p>Email: {userDetails.email}</p>
                    {/* Add more fields as necessary */}
                </div>
            ) : (
                <p>Loading...</p> // You might want to show a loading spinner instead
            )}
        </div>
    );
};

export default MyProfile;
