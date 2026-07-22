import Login from "../components/Login";

function LoginPage({ setLoggedIn }) {

  return <Login onLogin={() => { setLoggedIn(true); }} />;

}

export default LoginPage;
