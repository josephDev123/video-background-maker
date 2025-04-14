import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-purple-400">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-purple-400">404</h1>
        <p className="text-xl mb-4 text-purple-400">Oops! Page not found</p>
        <a href="/" className="text-purple-400 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
