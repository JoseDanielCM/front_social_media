import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Followers({ theme }) {

    useEffect(() => {
        axios
            .get("http://localhost:1234/api/user/followers", { withCredentials: true })
            .then((response) => {
                console.log(response.data);
                setUser(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al obtener usuario", error);
                setLoading(false);
            });
    }, []);

    return (
        <div>Followers</div>
    )
}

export default Followers