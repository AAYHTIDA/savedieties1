import React from 'react';

const AboutMe: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a192f] text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="1" fill="#64ffda" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-2 text-gray-400">
          <span className="text-[#64ffda]">&gt;</span>
          <span className="font-mono">~/portfolio</span>
          <span className="animate-pulse">_</span>
        </div>
        <div className="flex items-center gap-8 font-mono text-sm">
          <a href="#" className="text-white hover:text-[#64ffda] transition-colors">./home.jsx</a>
          <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors">about.jsx</a>
          <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors">skills.jsx</a>
          <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors">experience.jsx</a>
          <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors">projects.jsx</a>
          <a href="#" className="text-gray-400 hover:text-[#64ffda] transition-colors">contact.jsx</a>
          <span className="text-2xl">🌙</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-8 py-12">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-16">
          About <span className="text-[#64ffda]">Me</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Code Editor Section */}
          <div className="bg-[#1a1a2e] rounded-2xl shadow-2xl overflow-hidden border border-gray-700/50">
            {/* Editor Header */}
            <div className="flex items-center px-4 py-3 bg-[#1a1a2e] border-b border-gray-700/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-400 text-sm font-mono mx-auto">bio.tsx</span>
            </div>
            
            {/* Code Content */}
            <div className="p-8 font-mono text-base leading-loose">
              <div className="text-gray-500">/**</div>
              <div className="text-gray-500"> * About Me</div>
              <div className="text-gray-500"> * --------------------------</div>
              <div className="text-gray-500"> * passionate full-stack developer and AI/ML enthusiast who</div>
              <div className="text-gray-500"> * loves building meaningful products and learning something</div>
              <div className="text-gray-500"> * new every day.</div>
              <div className="text-gray-500"> */</div>
              <div className="mt-6">
                <span className="text-purple-400">const</span>{' '}
                <span className="text-blue-300">developer</span>{' '}
                <span className="text-white">=</span>{' '}
                <span className="text-yellow-400">{'{'}</span>
              </div>
              <div className="ml-6 mt-2">
                <span className="text-gray-300">name</span>
                {'   '}
                <span className="text-green-400">'Ashiq Noor Sudheer'</span>
              </div>
              <div className="ml-6 mt-2">
                <span className="text-gray-300">passion</span>
                {'  '}
                <span className="text-green-400">'Crafting Robust Applications'</span>
              </div>
              <div className="ml-6 mt-2">
                <span className="text-gray-300">hobbies</span>
                {'  '}
                <span className="text-yellow-400">[</span>
                <span className="text-green-400">'Coding'</span>
                {'  '}
                <span className="text-green-400">'Chess'</span>
                {'  '}
                <span className="text-green-400">'Reading'</span>
                <span className="text-yellow-400">]</span>
              </div>
              <div className="ml-6 mt-2">
                <span className="text-gray-300">status</span>
                {'   '}
                <span className="text-green-400">'Hustling'</span>
              </div>
              <div className="mt-2">
                <span className="text-yellow-400">{'}'}</span>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="relative">
            {/* Section Header */}
            <div className="flex justify-center mb-8">
              <span className="bg-[#1a365d] text-[#64ffda] px-4 py-2 rounded font-mono text-sm">
                &lt;Education & History /&gt;
              </span>
            </div>

            {/* Timeline */}
            <div className="space-y-8 relative">
              {/* Vertical Line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-600"></div>

              {/* B.Tech */}
              <div className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-[#64ffda] z-10"></div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-mono mb-1">
                    CGPA: <span className="text-[#64ffda]">9.69</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">B.Tech in Computer Science</h3>
                  <p className="text-gray-400 font-mono text-sm">Indian Institute of Information Technology, Kottayam</p>
                </div>
              </div>

              {/* Grade XII */}
              <div className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-400 z-10"></div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-mono mb-1">
                    score: <span className="text-orange-400">93.4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">AISSCE (Grade XII)</h3>
                  <p className="text-gray-400 font-mono text-sm">Sharjah Indian School</p>
                </div>
              </div>

              {/* Grade X */}
              <div className="flex gap-6 relative">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full bg-orange-400 z-10"></div>
                </div>
                <div className="flex-1">
                  <div className="text-gray-400 text-sm font-mono mb-1">
                    score: <span className="text-orange-400">89.6</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">AISSCE (Grade X)</h3>
                  <p className="text-gray-400 font-mono text-sm">Sharjah Indian School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative hexagon */}
      <div className="absolute top-1/4 right-10 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <polygon points="100,10 190,60 190,140 100,190 10,140 10,60" fill="none" stroke="#64ffda" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
};

export default AboutMe;
