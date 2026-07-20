import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SubjectPage from "./pages/SubjectPage";
import TopicPage from "./pages/TopicPage";
import InterviewPage from "./pages/InterviewPage";
import Dashboard from "./pages/Dashboard";
import DsaLab from "./pages/DsaLab";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="dsa-lab" element={<DsaLab />} />
          <Route path="interview" element={<InterviewPage />} />
          <Route path=":subjectId" element={<SubjectPage />} />
          <Route
            path=":subjectId/topic/:topicId/:sectionId"
            element={<TopicPage />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
