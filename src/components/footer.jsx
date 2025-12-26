"use client";

import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand / Copyright */}
          <p className="text-sm">
            © {new Date().getFullYear()} FinSight. All rights reserved.
          </p>

          {/* Links */}
          <div className="flex gap-6 text-sm">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>

          {/* Credit */}
          <p className="text-sm">
            Built by{" "}
            <span className="text-white font-medium">Himanshu Azad</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
