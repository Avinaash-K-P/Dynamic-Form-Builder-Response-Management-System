import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AccountCircle,
  Logout,
  Menu,
  Person,
} from "@mui/icons-material";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    id: number; 
    username: string; 
    sub: string; 
    role_id: number; 
}

interface HeaderProps {
  onMenuClick: () => void;
}


const Header = ({
  onMenuClick,
}: HeaderProps) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  /* ================================ Get Username From JWT ================================= */ 

    const accessToken = localStorage.getItem( "access_token" );     
    
    let user = "User"; 
    
    if (accessToken) {
         try { 
            const decodedToken = jwtDecode<JwtPayload>(accessToken); 
            user = decodedToken.username; 
        } 
    
    catch (error) { console.error( "Unable to decode access token:", error ); } }

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    setMenuOpen(false);

    navigate("/login");
  };

  return (
    <header className="home-header">

      {/* Left Section */}
      <div className="header-left">
        
      <button
        type="button"
        className="header-menu-button"
        onClick={onMenuClick}
      >
        <Menu />
      </button>
        
        <div className="header-brand">
          <h1>
            Dynamic Form Builder
          </h1>

          <span>
            & Response Management System
          </span>
        </div>

      </div>

      {/* Right Section */}
      <div className="header-right">

        <span className="welcome-text">
          Welcome {user}
        </span>

        <div className="user-menu">

          <button
            type="button"
            className="user-menu-button"
            onClick={() =>
              setMenuOpen((previous) => !previous)
            }
          >
            <AccountCircle />
          </button>

          {menuOpen && (
            <div className="user-dropdown">

              <button
                type="button"
                onClick={handleProfile}
              >
                <Person />
                <span>Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
              >
                <Logout />
                <span>Logout</span>
              </button>

            </div>
          )}

        </div>

      </div>

    </header>
  );
};

export default Header;

