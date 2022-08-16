import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Landing,
  Features,
  Pricing,
  SharedLanding,
  Login,
  Register,
  Error,
  ProtectedRoute,
  Dashboard,
} from "./pages";

import { ScrollToTop } from "./components";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop>
          <Routes>
            {/* Landing page routes */}
            <Route path="/" element={<SharedLanding />}>
              <Route index element={<Landing />} />
              <Route path="features" element={<Features />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="*" element={<Error />} />
            </Route>
            {/* Protected routes */}
            <Route path="/" element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
}

export default App;
