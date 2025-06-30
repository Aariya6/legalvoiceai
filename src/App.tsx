import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Record } from './pages/Record';
import { Dashboard } from './pages/Dashboard';
import { ProcessingStatus } from './pages/ProcessingStatus';
import { CaseProvider } from './context/CaseContext';

function App() {
  return (
    <CaseProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/record" element={<Record />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/processing/:caseId" element={<ProcessingStatus />} />
          </Routes>
        </Layout>
      </Router>
    </CaseProvider>
  );
}

export default App;