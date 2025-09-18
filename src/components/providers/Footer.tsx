import React from 'react'

function Footer() {
    return (
        <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-700">
            © {new Date().getFullYear()} ReCodeDitor. All rights reserved.
        </footer>
    )
}

export default Footer
