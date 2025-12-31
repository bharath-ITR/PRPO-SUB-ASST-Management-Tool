import { useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import './Searchbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getRequests } from '../../redux/Action'
import {  useNavigate } from 'react-router-dom';
const Searchbar = () => {
  const [input, setInput] = useState();
  const dispatch = useDispatch();
  const { Requests } = useSelector((state) => state.getRequests);
  useEffect(() => {
    dispatch(getRequests());
  }, [dispatch]);

  const Searching = input
    ? Requests?.filter(
      item => item.PR_no.toLowerCase().includes(input.toLowerCase())
    )
    : [];

  const [isSearch, setIsSearch] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/Search`);
    setIsSearch('');
  };
  return (
    <div className='searchbar'>
      <div className="searchbar_wrapper" >
        <input type="text" placeholder='Search...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <SearchIcon className='btn-search' onClick={handleSubmit} />

      </div>
       {/*  {input ?
         <div style={{width:'80vw'}}>
          <POForm Searching={Searching} />
          </div>
          : null
        } */}


    </div>

  )
}

export default Searchbar