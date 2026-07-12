import { useState } from "react";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

function App() {

    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    return loggedIn
        ? <Dashboard />
        : <LoginPage onLogin={() => setLoggedIn(true)} />;

}

export default App;