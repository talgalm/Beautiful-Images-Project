import Header from "../../components/Header/Header";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

export default function InstructionsPage (){
    const navigate = useNavigate();

    function handleGoToRating(){
        navigate("/rating")
    } 
    return (
        <div className="header-wrapper">
            <Header/>
            <div className="guidelines-div">
                Here will be Guidelines!
                <button onClick={handleGoToRating}>Continue to rate !</button>
            </div>
        </div>
    );
}