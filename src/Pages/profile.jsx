import react, { Component } from "react";
import { Footer } from "../footer"
import { Search_Profiles } from "./Profiles/search-profile";
import { Profiles } from "./Profiles/profiles";
export class Profile_List extends Component{
    render(){
        return(
            <div>
                <Search_Profiles/>
                <Profiles/>
                <Footer/>
            </div>
        )
    }
}