import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="register" element={<Register />} />
              </Routes>
            </div>
          </Router>
    </QueryClientProvider>
  );
}

export default App;
