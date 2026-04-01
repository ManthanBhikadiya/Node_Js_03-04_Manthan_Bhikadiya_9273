import React, { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get("/profile");
                setUser(res.data);
            } catch (err) {
                alert("Access Denied. Please Log in.");
            }
        };

        fetchProfile();
    }, []);

    if (!user) return <p>Loading..........</p>;

    return (
        <>
            <div>profile</div>
            <p>Name : {user.name}</p>
            <p>Name : {user.email}</p>
        </>
    );
};

export default Profile;