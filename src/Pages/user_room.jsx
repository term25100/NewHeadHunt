import {Component} from "react";
import { UserRoom } from "./User_Room/UserRoom";
import { Light_Header } from "./User_Room/light_header";
export class User_Room extends Component{
    state={
        activeTab: "vacancy",
    };
    handleTabChange=(tab)=>{
        this.setState({activeTab: tab});
    };
    render(){
        return(
            <div>
                <Light_Header activeTab={this.state.activeTab} onTabChange={this.handleTabChange} />
                <UserRoom activeTab={this.state.activeTab} />
            </div>
        )
    }
}