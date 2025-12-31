
import './POCreation.css'
import { TextField, styled } from '@mui/material';
import Searchbar from '../../components/Searchbar/Searchbar';
const Field = styled(TextField)`
width: 30vw;
& label {
  z-index: auto;
}
`;
const POCreation = () => {
   
   


    




    return (
        <div className='pocreation'>
            <div className="pocreation_wrapper">               
             <Searchbar/>
            </div>
        </div>
    )

}

export default POCreation
