import React, { Component } from "react";
import { Search } from "./Vacancy/search";
import { Vacations } from "./Vacancy/vacations";
import { Footer } from "../footer"
export class Vacancy_List extends Component{
    constructor(props) {
        super(props);
        this.state = {
            searchParams: {
                profession: '',
                location: ''
            }
        };
    }

    handleSearch = (profession, location) => {
        this.setState({
            searchParams: {
                profession,
                location
            }
        });
    };
    render(){
        return(
            <div>
                <Search onSearch={this.handleSearch} />
                <Vacations searchParams={this.state.searchParams} />
                <Footer />
            </div>
        )
    }
}