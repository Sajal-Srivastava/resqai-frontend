import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/layout/Header';
import NavBar from './components/layout/NavBar';
import ToastContainer from './components/common/Toast';
import HomeScreen from './screens/HomeScreen';
import SOSScreen from './screens/SOSScreen';
import ResultScreen from './screens/ResultScreen';
import MedicalProfileScreen from './screens/MedicalProfileScreen';
import ContactsScreen from './screens/ContactsScreen';
import SettingsScreen from './screens/SettingsScreen';
import NearbyServicesScreen from './screens/NearbyServicesScreen';

function AppShell() {
  const { state } = useApp();
  const renderScreen = () => {
    switch (state.screen) {
      case 'home':     return <HomeScreen />;
      case 'sos':      return <SOSScreen />;
      case 'result':   return <ResultScreen />;
      case 'map':      return <NearbyServicesScreen />;
      case 'profile':  return <MedicalProfileScreen />;
      case 'contacts': return <ContactsScreen />;
      case 'settings': return <SettingsScreen />;
      default:         return <HomeScreen />;
    }
  };
  return (
    <div className="app-shell">
      <Header />
      <main className="app-content" key={state.screen}>
        {renderScreen()}
      </main>
      <NavBar />
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

export default App;
