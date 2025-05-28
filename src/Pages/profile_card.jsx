import { Component } from "react";
import { Footer } from "../footer";
import { User_Profile } from "./Profiles/user-profile";

export class Profile_Card extends Component{
    render(){
        return (
            <div>
                <User_Profile />
                <Footer />
            </div>
        );
    }
}
