import logo from '../../assets/logo.svg';
import setting_icon from '../../assets/settings.svg';
import './Navbar.scss';

export default function Navbar() {
    return (
        <div className="navbar">
            <div className="navbar__logo">
                <img src={logo} alt="logo" />
            </div>
            <div className='navbar__content'>
                <div>
                    <a href="/workspaces" className='link'>Workspaces</a>
                </div>
                <div className="navbar__user">
                    <div>
                        <a href="/" className='link'>Username</a>
                    </div>
                    <div className="navbar__setting">
                        <img src={setting_icon} alt="setting-icon" />
                    </div>
                </div>
            </div>
        </div>
    )
}