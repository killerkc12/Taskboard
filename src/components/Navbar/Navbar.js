import React, { useContext } from 'react';
import './Navbar.css';
import { TbMenu2 } from 'react-icons/tb';
import { AiOutlineSearch } from 'react-icons/ai';
import { UserContext } from '../../App';
import Popup from 'reactjs-popup';
import { BsPower } from 'react-icons/bs';

const Navbar = () => {
    const {state} = useContext(UserContext);

    
    
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

            <Popup
                trigger={
                    <div className='navbar__right'>
                        <img src={state?.photo} alt="" className="profile__pic"  />
                    </div>
                }
                position="left top"
                on="click"
                closeOnDocumentClick
                mouseLeaveDelay={300}
                mouseEnterDelay={0}
                contentStyle={{ padding: '0px', border: '1px black solid', borderRadius: '10px', }}
                arrowStyle={{ color: '#3A3C45'}}
                arrow={false}
            >
                <MenuOptions />
            </Popup>
        </div>
    );
};

const MenuOptions = () => {
    const {dispatch} = useContext(UserContext);
    const Logout = () => {
        localStorage.clear();
        dispatch({type:'CLEAR'});
    };
    return (
        <div className="menu">
            <div className="menu-item"
                onClick={Logout}
            > 
                <BsPower className='menu-icon' />
                Logout 
            </div>
        </div>
    );
};

export default Navbar;