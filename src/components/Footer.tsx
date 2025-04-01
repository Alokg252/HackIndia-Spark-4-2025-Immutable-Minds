const Footer = () => {
  const quickLinks = [
    { label: 'About us', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Pricing', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' }
  ];

  const subjects = [
    { label: 'Psychology & Mental Health', href: '#' },
    { label: 'Healthcare & Medicine', href: '#' },
    { label: 'IT & Computer Science', href: '#' },
    { label: 'Business & Management', href: '#' },
    { label: 'Design & Creative', href: '#' }
  ];

  const support = [
    { label: 'Help Center', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Settings', href: '#' }
  ];

  const socialLinks = [
    {
      label: 'Twitter',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
        </svg>
      )
    },
    {
      label: 'LinkedIn',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    {
      label: 'Instagram',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-[#111111] text-white pt-20 pb-8">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-12 gap-8 pb-16 border-b border-gray-800">
          {/* Brand and Newsletter */}
          <div className="col-span-4">
            <div className="flex items-center mb-8">
              <span className="text-2xl font-bold">
                <span className="text-[#FF4D4D]">Learn</span>ify
              </span>
            </div>
            <p className="text-gray-400 mb-8">
              Join our newsletter to stay up to date on features and releases.
            </p>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D4D]"
              />
              <button className="bg-[#FF4D4D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#FF3333] transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              By subscribing you agree to with our Privacy Policy.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-span-2">
            <h3 className="font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subjects */}
          <div className="col-span-3">
            <h3 className="font-semibold mb-6">Popular Subjects</h3>
            <ul className="space-y-4">
              {subjects.map((subject, index) => (
                <li key={index}>
                  <a href={subject.href} className="text-gray-400 hover:text-white transition-colors">
                    {subject.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-3">
            <h3 className="font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              {support.map((item, index) => (
                <li key={index}>
                  <a href={item.href} className="text-gray-400 hover:text-white transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex justify-between items-center pt-8">
          <p className="text-gray-400 text-sm">
            © 2024 Learnify. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 