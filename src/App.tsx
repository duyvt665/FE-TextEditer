import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/home/Home";
import Information from "./pages/Information";
import Storage from "./pages/Storage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route
                path="/home"
                element={<ProtectedRoute element={<Home />} />}
              />
              <Route
                path="/user/information"
                element={<ProtectedRoute element={<Information />} />}
              />
              <Route
                path="/user/storage"
                element={<ProtectedRoute element={<Storage />} />}
              />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
