'use client';

import { useRouter } from 'next/navigation';

export default function FloatingMenu() {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white rounded-2xl shadow-2xl px-6 py-3 flex items-center gap-8 backdrop-blur-sm border border-gray-100">
        {/* Home */}
        <button 
          onClick={() => router.push('/landing')}
          className="flex flex-col items-center justify-center gap-1 group p-2 rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:shadow-lg"
        >
          <img src="/home.png" alt="Home" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-gray-700 font-medium transition-colors duration-300 group-hover:text-[#374957]">Home</span>
        </button>

        {/* Pricing */}
        <button 
          onClick={() => router.push('/pricing')}
          className="flex flex-col items-center justify-center gap-1 group p-2 rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:shadow-lg"
        >
          <img src="/price.png" alt="Pricing" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-gray-700 font-medium transition-colors duration-300 group-hover:text-[#374957]">Pricing</span>
        </button>

        {/* Register */}
        <button 
          onClick={() => router.push('/register')}
          className="flex flex-col items-center justify-center gap-1 group p-2 rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:shadow-lg"
        >
          <img src="/register.png" alt="Register" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-gray-700 font-medium transition-colors duration-300 group-hover:text-[#374957]">Register</span>
        </button>

        {/* About */}
        <button 
          onClick={() => router.push('/about')}
          className="flex flex-col items-center justify-center gap-1 group p-2 rounded-full transition-all duration-300 hover:bg-gray-50 hover:scale-110 hover:shadow-lg"
        >
          <img src="/about.png" alt="About" className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
          <span className="text-xs text-gray-700 font-medium transition-colors duration-300 group-hover:text-[#374957]">About</span>
        </button>
      </div>
    </div>
  );
}

