import React, { useState } from "react";
import Select from "react-select";
import classes from "../assets/styles/sidebar.module.css";
import { Login } from "./login";
import { User } from "../services/user";

import { faS, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faS, faArrowRight);

interface SideBarProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    setMapType: React.Dispatch<React.SetStateAction<string>>;
}

interface MapTypeOption {
    value: string;
    label: string;
}

export const SideBar = ({ user, setUser, setMapType }: SideBarProps) => {
    const [showSideBar, setShowSideBar] = useState(false);
    const [selectValue, setSelectValue] = useState<MapTypeOption>(null);

    const mapTypeOptions: MapTypeOption[] = [
        { value: "Vending Machine", label: "Vending Machine" },
        { value: "Water Fountain", label: "Water Fountain" },
        { value: "Public Shower", label: "Public Shower" },
    ];

    const toggleSideBar = () => {
        setShowSideBar(!showSideBar);
    };

    const onMapTypeChange = (newType: MapTypeOption) => {
        setSelectValue(newType);
        setMapType(newType.value);
    };

    return (
        <div className={classes.SideBarContainer}>
            <div className={`${classes.SideBar} ${(showSideBar) ? classes.SideBarShow : ""}`}>
                <Login
                    user={user}
                    setUser={setUser} />
                <Select
                    isSearchable={false}
                    className={classes.MapTypeSelect}
                    value={selectValue || mapTypeOptions[0]}
                    onChange={onMapTypeChange}
                    options={mapTypeOptions} />
            </div>
            <div className={classes.SideBarToggle}>
                <FontAwesomeIcon
                    className={`${classes.SideBarToggleIcon} ${(showSideBar) ? classes.SideBarToggleIconLeft : ""}`}
                    onClick={toggleSideBar}
                    icon={["fas", "arrow-right"]} />
            </div>
        </div>
    );
};