import React, { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navMenus } from '../../utils/naviList';
import { FcGoogle } from 'react-icons/fc';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { Login, logout } from '../../redux/slices/authSlice';
import { useState } from 'react';

const Navibar = () => {
  const path = useLocation();
  const isActive = (location) => path.pathname === location.to;
  const googleClientId = import.meta.env.VITE_AUTH_CLIENT_ID;
  const dispatch = useDispatch();
  const state = useSelector((state) => state.auth.authData);

  // !!name 값이 있는지 엄격히 체크
  const { name } = state || {};
  const [isAuth, setIsAuth] = useState(!!name);

  const handleSuccess = useCallback(
    (credentialResponse) => {
      try {
        const decoded = jwtDecode(credentialResponse.credential);
        dispatch(Login({ authData: decoded }));
        setIsAuth(true);
      } catch (error) {
        console.error('Google Login Error: ', error);
      }
    },
    [dispatch],
  );

  const handleLogoutClick = () => {
    dispatch(logout());
    setIsAuth(false);
  };

  const handleError = (error) => {
    console.log('Google Login Error: ', error);
  };
  return (
    <nav className="bg-[#212121] w-1/5 h-full rounded-lg border border-gray-500 py-10 px-4 flex flex-col justify-between items-center">
      <div className="logo-wrapper flex w-full justify-center items-center gap-8">
        <div className="logo"></div>
        <h2 className="font-semibold text-xl">
          <Link to="/">BEOM</Link>
        </h2>
      </div>
      <ul className="menus">
        {navMenus.map((menu, idx) => (
          <li
            key={idx}
            className={`rounded-sm mb-2 border border-gray-700 hover:bg-slate-950 transition-all duration-300 ${
              isActive(menu.to) ? 'bg-slate-950' : ''
            }`}
          >
            <Link to={menu.to} className="flex gap-4 items-center py-2 px-10">
              {menu.icon} {menu.label}
            </Link>
          </li>
        ))}
      </ul>
      {isAuth ? (
        <div className="auth-button w-4/5 flex items-center ">
          <button
            className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-3 px-4 rounded-md w-full"
            onClick={handleLogoutClick}
          >
            <FcGoogle className="w-5 h-5" />
            <span className="text-sm">{name}님 로그아웃</span>
          </button>
        </div>
      ) : (
        <div className="auth-wrapper flex justify-center w-4/5 login-btn">
          <GoogleOAuthProvider clientId={googleClientId}>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
            <button className="flex justify-center items-center gap-2 bg-gray-300 text-gray-900 py-3 px-4 rounded-md w-full">
              <FcGoogle className="w-5 h-5" />
              <span className="text-sm">Google로 로그인</span>
            </button>
          </GoogleOAuthProvider>
        </div>
      )}
      {/* */}
    </nav>
  );
};

export default Navibar;
