import React, { useContext } from 'react';
import './Navbar.css';
import { TbMenu2 } from 'react-icons/tb';
import Search from './Search';
import { UserContext } from '../../App';
import Popup from 'reactjs-popup';
import { BsPower } from 'react-icons/bs';
import { AppSwitcher } from '@killerkc12/shared';
import { auth } from '../../firebase/firebase';
import { ssoSignOut } from '@killerkc12/shared';

// eslint-disable-next-line react/prop-types
const Navbar = ({ onMenu, boards = [], onSwitch }) => {
    const {state} = useContext(UserContext);

    
    
    return (
        <div className='navbar__container'>
            {/* TODO: Menu symbol and Logout */}
            <div className='navbar__left'>
                <button type='button' className='navbar__menu-btn' onClick={onMenu} aria-label='Open menu'>
                    <TbMenu2 className='navbar__menu' />
                </button>
                <p className='navbar__logo__text'>TaskBoard</p>
            </div>

            <Search boards={boards} onSwitch={onSwitch} />

            <div className='navbar__switcher' style={{ color: '#d1d3db', marginLeft: 'auto', marginRight: 8 }}>
                <AppSwitcher current='taskboard' />
            </div>

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
    const Logout = async () => {
        await ssoSignOut(auth);
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