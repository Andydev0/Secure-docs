import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaHome, FaFileAlt, FaUsers, FaClipboardList, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white flex items-center space-x-2">
              <FaHome className="text-white" />
              <span>SecureDocs</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/posts"
              className="text-white hover:bg-blue-700 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
            >
              <FaFileAlt />
              <span>Documentos</span>
            </Link>

            {session?.user?.role === 'ADMIN' && (
              <>
                <Link
                  href="/admin/users"
                  className="text-white hover:bg-blue-700 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <FaUsers />
                  <span>Usuários</span>
                </Link>
                <Link
                  href="/admin/logs"
                  className="text-white hover:bg-blue-700 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <FaClipboardList />
                  <span>Logs</span>
                </Link>
              </>
            )}
          </div>

          {/* User and Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-white text-sm">{session.user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="text-white hover:bg-red-600 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-white hover:bg-blue-700 hover:text-gray-100 px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/posts"
              className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
            >
              <FaFileAlt />
              <span>Documentos</span>
            </Link>

            {session?.user?.role === 'ADMIN' && (
              <>
                <Link
                  href="/admin/users"
                  className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                >
                  <FaUsers />
                  <span>Usuários</span>
                </Link>
                <Link
                  href="/admin/logs"
                  className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                >
                  <FaClipboardList />
                  <span>Logs</span>
                </Link>
              </>
            )}

            {session ? (
              <>
                <div className="border-t border-blue-600 my-2"></div>
                <div className="px-3 py-2 text-white text-sm">{session.user.email}</div>
                <button
                  onClick={() => signOut()}
                  className="text-white hover:bg-red-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Sair</span>
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className="text-white hover:bg-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
