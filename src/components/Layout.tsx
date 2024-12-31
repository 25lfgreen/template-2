import { Home, BookOpen, Trophy } from 'lucide-react';
import { NavLink } from 'react-router-dom';

// Add a persistent bottom navigation bar
const BottomNav = () => (
  <nav className="fixed bottom-0 inset-x-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-800">
    <div className="max-w-4xl mx-auto flex justify-around p-3">
      <NavLink to="/dashboard">
        <Home className="w-6 h-6" />
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink to="/journal">
        <BookOpen className="w-6 h-6" />
        <span className="text-xs">Journal</span>
      </NavLink>
      <NavLink to="/skills">
        <Trophy className="w-6 h-6" />
        <span className="text-xs">Skills</span>
      </NavLink>
    </div>
  </nav>
); 