import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoadingProvider } from './components/LoadingContext';
import LoadingIndicator from './components/LoadingIndicator';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import LoggedTest from './pages/LoggedTest';
import Voice from './components/Voice';
import WordInput from './pages/WordInput';
import IsLoggedType from './pages/IsLoggedType';
import LoggedType from './pages/LoggedType';
import Loading from './pages/Loading';
import LoggedLoading from './pages/LoggedLoading';
import Mypage from './pages/Mypage';
import IsLoggedTest from './pages/IsLoggedTest';
import IsLoggedAnswer from './pages/IsLoggedAnswer';
import LoggedAnswer from './pages/LoggedAnswer';
import AdWordCheck from './pages/AdWordCheck';
import AdWordList from './pages/AdWordList';
import VoiceHome from './pages/VoiceHome';
import VoiceTalk from './pages/VoiceTalk';
import VoiceQR from './pages/VoiceQR';

function App() {
  return (
    <div className="appContainer">
      <LoadingProvider>
        <Router>
          <LoadingIndicator />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signuppage" element={<Signup />} />
            <Route path="/loginpage" element={<Login />} />
            <Route path="/isLogged/test" element={<IsLoggedTest />} />
            <Route path="/Logged/test" element={<LoggedTest />} />
            <Route path="/speech_to_text" element={<Voice />} />
            <Route path="/word" element={<WordInput />} />
            <Route path="/isLogged/type" element={<IsLoggedType />} />
            <Route path="/Logged/type" element={<LoggedType />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/logged/loading" element={<LoggedLoading />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/isLogged/answer" element={<IsLoggedAnswer />} />
            <Route path="/Logged/answer" element={<LoggedAnswer />} />
            <Route path="/admin/word/check" element={<AdWordCheck />} />
            <Route path="/admin/word/list" element={<AdWordList />} />
            <Route path="/voice/home" element={<VoiceHome />} />
            <Route path="/voice/talk" element={<VoiceTalk />} />
            <Route path="/QR" element={<VoiceQR />} />
          </Routes>
        </Router>
      </LoadingProvider>
    </div>
  );
}

export default App;
