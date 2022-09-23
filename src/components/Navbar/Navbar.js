import React, { useContext } from 'react';
import './Navbar.css';
import { TbMenu2 } from 'react-icons/tb';
import { AiOutlineSearch } from 'react-icons/ai';
import { UserContext } from '../../App';

const Navbar = () => {
    const {state,dispatch} = useContext(UserContext);

    const Logout = () => {
        localStorage.clear();
        dispatch({type:'CLEAR'});
    };
    
    return (
        <div className='navbar__container'>
            {/* TODO: Menu symbol and Logout */}
            <div className='navbar__left'>
                <TbMenu2 className='navbar__menu' />
                <p className='navbar__logo__text'>TasksBoard</p>
            </div>

            {/* TODO: Search box */}
            <div className='navbar__middle'>
                <div className="search__logo_container">
                    <AiOutlineSearch className='search__logo' />
                </div>
                <div className="input__container">
                    <input type="text" placeholder='Search' className='search__input' />
                </div>
            </div>

            {/* TODO: Profile Photoz */}
            <div className='navbar__right'>
                <img src={state?.photo} alt="" className="profile__pic" onClick={Logout} />
            </div>
        </div>
    );
};

export default Navbar;