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
} from "./pages";

import {
  SharedMain,
  Dashboard,
  Trades,
  Journal,
  Rules,
  Profile,
} from "./pages/protected-routes";

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
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <SharedMain />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="trades" element={<Trades />} />
              <Route path="journal" element={<Journal />} />
              <Route path="rules" element={<Rules />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
}

export default App;
