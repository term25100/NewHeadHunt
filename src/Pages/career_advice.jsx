import React, { Component } from "react";

import { Footer } from "../footer.jsx";
import '../App.jsx'
import { Career_page } from "./Career/career_page.jsx";

export class Career extends Component{
    render(){
        return (
            <div>
                <Career_page />
                <Footer/>
            </div>
        )
    }
}