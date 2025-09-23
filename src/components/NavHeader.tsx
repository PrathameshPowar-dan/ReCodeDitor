import HeaderProfileBtn from "@/app/(home)/_components/HeaderProfileBtn";
import { SignedOut } from "@clerk/nextjs";
import { Beer, Code2, Sparkles } from "lucide-react";
import Link from "next/link";

function NavigationHeader() {
  return (
    <div className="relative z-10 flex justify-center">
      <div className="flex w-[97vw] items-center lg:justify-between justify-between backdrop-blur-xl p-6 mb-3 rounded-xl border border-gray-800/50 shadow-lg">
        <div className="flex items-center gap-0 md:gap-4">
          <Link href="/" className="flex items-center gap-2 group relative">
            <div
              className="absolute -inset-2 bg-gradient-to-r from-orange-600/20 to-green-600/20 rounded-lg opacity-0 
              group-hover:opacity-100 transition-all duration-500 blur-xl"
            />

            <div
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-2 rounded-xl ring-1
              ring-white/10 group-hover:ring-orange-500/30 transition-all shadow-md"
            >
              <Beer className="size-6 text-orange-500 group-hover:text-green-500 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
            </div>

            <div className="flex flex-col">
              <span className="hidden md:block text-base md:text-lg font-bold bg-gradient-to-r from-orange-400 via-white to-green-400 text-transparent bg-clip-text">
                ReCodeDitor
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link
              href="/snippets"
              className="relative group flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 bg-gray-800/60 
              hover:bg-orange-600/20 border border-gray-700/50 hover:border-orange-500/50 transition-all duration-300 shadow-sm overflow-hidden"
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-orange-600/10 
                to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <Code2 className="w-4 h-4 relative z-10 group-hover:scale-110 transition-transform" />
              <span
                className="text-sm font-medium hidden md:block relative z-10 group-hover:text-white
                 transition-colors"
              >
                Snippets
              </span>
            </Link>
          </nav>
        </div>

        <div className="flex justify-evenly items-center gap-2 md:gap-4">
          <SignedOut>
            <Link
              href="/pricing"
              className="flex flex-row items-center gap-1 px-4 py-2 rounded-lg border border-green-500/30 hover:border-green-400/50 bg-gradient-to-r from-amber-600/10
                to-yellow-600/10 hover:from-yellow-600/20 hover:to-yellow-600/20
                transition-all duration-300 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-green-400 hover:text-green-300" />
              <span className="text-xs md:text-base font-medium text-green-400/90 hover:text-green-300">
                Pro
              </span>
            </Link>
          </SignedOut>

          <HeaderProfileBtn />
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;