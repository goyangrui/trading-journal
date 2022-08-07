import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  Landing,
  Features,
  Pricing,
  SharedLanding,
  Login,
  Register,
} from "./pages";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Landing page routes */}
          <Route path="/" element={<SharedLanding />}>
            <Route index element={<Landing />} />
            <Route path="features" element={<Features />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
