import React, { useState, useEffect } from "react";
import { Search } from "./Vacancy/search";
import { User_Vacations } from "./Vacancy/User_vacations";
import { Footer } from "../footer";
import { useLocation } from "react-router-dom";

export function User_vacations() {
    const location = useLocation();
    const [searchParams, setSearchParams] = useState({
        profession: '',
        location: ''
    });

    useEffect(() => {
        if (location.state) {
            setSearchParams({
                profession: location.state.profession || '',
                location: location.state.location || ''
            });
        }
    }, [location.state]);

    const handleSearch = (profession, location) => {
        setSearchParams({
            profession,
            location
        });
    };

    const handleParamsChange = (newParams) => {
        setSearchParams(prev => ({
            ...prev,
            ...newParams
        }));
    };

    return (
        <div>
            <Search 
                onSearch={handleSearch} 
                onParamsChange={handleParamsChange}
                searchParams={searchParams} 
            />
            <User_Vacations 
                searchParams={searchParams} 
                initialSearch={!location.state} 
            />
            <Footer />
        </div>
    );
}