import React, { Component } from "react";
import { Banner } from "./Home/banner.jsx";
import { Suggest } from "./Home/suggest.jsx";
import { Company } from "./Home/company.jsx";
import { Footer } from "../footer.jsx";
import '../App.jsx'
import { Career_Advice } from "./Home/career_advice.jsx";

export class Home extends Component{
    render(){
        return (
            <div>
                <Banner/>
                <Suggest/>
                <Company/>
                <Career_Advice/>
                <Footer/>
            </div>
        )
    }
}












      