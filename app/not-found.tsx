// This would typically live in its own CSS file or within a <style jsx> block if using Next.js CSS Modules
/*
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.floating-text {
  animation: float 3s ease-in-out infinite;
}
*/

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden">
      {/* Optional: Add some subtle background elements like stars or a subtle nebula */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>

      <h1 className="text-7xl md:text-9xl font-extrabold text-blue-400 z-10 floating-text">404</h1>
      <p className="text-3xl md:text-4xl font-light text-gray-300 mb-10 z-10 text-center max-w-lg px-4">
        Looks like this page took a detour to another dimension.
      </p>
      <a
        href="/"
        className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out z-10"
      >
        Beam Me Up, Scotty! (Back Home)
      </a>
    </div>
  );
}