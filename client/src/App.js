// react router dom
import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import { Landing, Features, Pricing, SharedLanding } from "./pages";

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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
