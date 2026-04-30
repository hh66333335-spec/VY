/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');

  return (
    <LanguageProvider>
      <div className="w-full min-h-screen bg-black">
        {view === 'landing' ? (
          <LandingPage onStart={() => setView('dashboard')} />
        ) : (
          <Dashboard />
        )}
      </div>
    </LanguageProvider>
  );
}
