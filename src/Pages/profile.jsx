import react, { Component } from "react";
import { Footer } from "../footer"
import { Search_Profiles } from "./Profiles/search-profile";
import { Profiles } from "./Profiles/profiles";
export class Profile_List extends Component{
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
                <Profiles searchParams={this.state.searchParams}/>
                <Footer/>
            </div>
        )
    }
}