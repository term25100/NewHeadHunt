import react, {Component} from "react";
import { Footer } from "../footer";
import { Vacation_Body } from "./Vacancy/vacation";
export class Vacation extends Component{
    render(){
        return (
            <div>
                <Vacation_Body />
                <Footer />
            </div>
        );
    }
}