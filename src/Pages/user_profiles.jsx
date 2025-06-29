import react, { Component } from "react";
import { Footer } from "../footer"
import { Search_Profiles } from "./Profiles/search-profile";
import { User_Profiles } from "./Profiles/User_profiles";
export class User_profiles extends Component{
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
                <Search_Profiles onSearch={this.handleSearch}/>
                <User_Profiles searchParams={this.state.searchParams}/>
                <Footer/>
            </div>
        )
    }
}