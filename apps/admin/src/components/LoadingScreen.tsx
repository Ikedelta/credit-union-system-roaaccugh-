import React from 'react';
import './LoadingScreen.css';
import logoUrl from '../assets/logo.png';

interface LoadingScreenProps {
  fullScreen?: boolean;
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ fullScreen = false, message = 'Loading...' }) => {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="loading-logo-wrapper">
        <div className="loading-ring"></div>
        <img src={logoUrl} alt="Loading..." className="loading-logo" />
      </div>
      <div className="loading-text">{message}</div>
    </div>
  );
};

export default LoadingScreen;
