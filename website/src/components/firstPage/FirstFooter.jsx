import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const socialLinks = [
    { icon: faFacebook, url: "#" },
    { icon: faTwitter, url: "#" },
    { icon: faLinkedin, url: "#" },
    { icon: faInstagram, url: "#" }
  ];

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Grid layout for footer sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>Satish welcomes you</li>
              <li>123 Education Noida</li>
              <li>satish151104@gmail.com</li>
              <li>+(91) 7011840985</li>
            </ul>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <li href="#admissions" className="hover:text-blue-400 transition-colors no-underline">
                  Admissions
                </li>
              </li>
              <li>
                <li href="#courses" className="hover:text-blue-400 transition-colors no-underline">
                  Courses
                </li>
              </li>
              <li>
                <li href="#research" className="hover:text-blue-400 transition-colors no-underline">
                  Research
                </li>
              </li>
              <li>
                <li href="#events" className="hover:text-blue-400 transition-colors no-underline">
                  Events
                </li>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  className="text-2xl hover:text-blue-400 transition-colors"
                >
                  <FontAwesomeIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-gray-800 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Satish. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
