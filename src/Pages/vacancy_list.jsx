import react, { Component } from "react";
import { Search } from "./Vacancy/search";
import { Vacations } from "./Vacancy/vacations";
import { Footer } from "../footer"
export class Vacancy_List extends Component{
    render(){
        return(
            <div>
                <Search/>
                <Vacations/>
                <Footer/>
            </div>
        )
    }
}