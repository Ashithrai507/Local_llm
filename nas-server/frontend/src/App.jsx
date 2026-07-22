import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Cloud from "./pages/Cloud";
import Movies from "./pages/Movies";
import Music from "./pages/Music";
import LLM from "./pages/LLM";

function App() {

    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={!loggedIn ? <Login setLoggedIn={setLoggedIn} /> : <Navigate to="/dashboard" />}
                />

                <Route
                    path="/dashboard"
                    element={loggedIn ? <Dashboard /> : <Navigate to="/" />}
                />

                <Route
                    path="/cloud"
                    element={loggedIn ? <Cloud /> : <Navigate to="/" />}
                />

                <Route
                    path="/movies"
                    element={loggedIn ? <Movies /> : <Navigate to="/" />}
                />

                <Route
                    path="/music"
                    element={loggedIn ? <Music /> : <Navigate to="/" />}
                />

                <Route
                    path="/llm"
                    element={loggedIn ? <LLM /> : <Navigate to="/" />}
                />

                <Route path="*" element={<Navigate to={loggedIn ? "/dashboard" : "/"} />} />
            </Routes>
        </BrowserRouter>
    );

}

export default App;