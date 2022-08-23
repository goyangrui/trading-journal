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
              {/* /app route with no other path will render an error component */}
              <Route index element={<Error />} />

              {/* valid protected paths */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="trades" element={<Trades />} />
              <Route path="journal" element={<Journal />} />
              <Route path="rules" element={<Rules />} />
              <Route path="profile" element={<Profile />} />

              {/* /app route containing any other path than the ones above will also render error component */}
              <Route path="*" element={<Error />} />
            </Route>
          </Routes>
        </ScrollToTop>
      </BrowserRouter>
    </>
  );
}

export default App;
