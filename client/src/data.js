export const serviceCategories = [
  { id: 'service', label: 'AC Service' },
  { id: 'repair', label: 'Repair & Gas Refill' },
  { id: 'install', label: 'Install & Uninstall' }
];

export const services = [
  {
    id: 1,
    category: 'service',
    title: "Foam & Power Jet AC Service",
    description: "2X deeper dust removal with foam cleaning. Recommended for 6-month cleaning.",
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: "1.2M",
    includes: ["Foam cleaning", "Power jet wash", "Drain pipe cleaning"],
    icon: "Wind",
    tag: "Best Seller"
  },
  {
    id: 2,
    category: 'service',
    title: "Anti-rust Deep Clean AC Service",
    description: "Prevents gas leakage. Includes coil coating to prevent rust.",
    price: 899,
    originalPrice: 1099,
    rating: 4.9,
    reviews: "800K",
    includes: ["Anti-rust coating", "Foam cleaning", "Gas check"],
    icon: "ShieldCheck"
  },
  {
    id: 3,
    category: 'repair',
    title: "AC Gas Leak Fix & Refill",
    description: "Full gas charging with leak identification and repair.",
    price: 2499,
    originalPrice: 2999,
    rating: 4.7,
    reviews: "500K",
    includes: ["Leak test", "Gas charging", "Pre-service check"],
    icon: "Snowflake"
  },
  {
    id: 4,
    category: 'repair',
    title: "Same Day AC Repair",
    description: "Diagnostic visit within 2 hours. Cost of parts is extra.",
    price: 299,
    originalPrice: 499,
    rating: 4.6,
    reviews: "2M",
    includes: ["Diagnostic check", "2-hour arrival", "Minor fixes"],
    icon: "Tool"
  },
  {
    id: 5,
    category: 'install',
    title: "AC Installation",
    description: "Standard installation for split/window AC. 5-meter copper pipe check.",
    price: 1499,
    originalPrice: 1999,
    rating: 4.8,
    reviews: "100K",
    includes: ["Drilling", "Indoor/Outdoor setup", "Function test"],
    icon: "ShieldRotate"
  }
];

export const testimonials = [
  {
    name: "Ritika Sharma",
    role: "Apartment Owner",
    avatar: "https://i.pravatar.cc/150?u=ritika",
    comment: "Very clean work, exact timing, and the AC cooling improved the same day. The team felt truly professional."
  },
  {
    name: "Aman Verma",
    role: "Cafe Manager",
    avatar: "https://i.pravatar.cc/150?u=aman",
    comment: "We needed urgent service before weekend footfall. They handled two units fast and explained every charge clearly."
  },
  {
    name: "Neha Kapoor",
    role: "Office Admin",
    avatar: "https://i.pravatar.cc/150?u=neha",
    comment: "The website looked trustworthy and the actual service matched it. Good communication and polished technicians."
  }
];

export const faqs = [
  {
    question: "How often should I get my AC serviced?",
    answer: "It's recommended to get a professional jet service every 6 months to maintain cooling efficiency and air quality."
  },
  {
    question: "Do you provide warranty on repairs?",
    answer: "Yes, we provide a 30-day warranty on all repairs and a 90-day warranty on gas refills."
  },
  {
    question: "What is power jet cleaning?",
    answer: "Power jet cleaning uses a high-pressure water pump to remove deep-seated dust and grime from AC coils that normal brush cleaning can't reach."
  }
];

export const blogPosts = [
  {
    id: 1,
    category: 'Commercial',
    title: "Optimizing Glacier-Tech: The Industrial Advantage",
    desc: "A deep dive into how high-capacity cooling systems are transforming data center efficiency and reducing overhead by 30%.",
    date: "Oct 24, 2026",
    readTime: "12 Min",
    expert: "Dr. Aris Thorne",
    img: "https://images.unsplash.com/photo-1558389186-438424b00a32?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 2,
    category: 'Maintenance',
    title: "Surgical Precision: The 12-Point Service Protocol",
    desc: "Why standard cleaning isn't enough. Our proprietary foam-jet system targets microscopic dust clusters for pure airflow.",
    date: "Oct 21, 2026",
    readTime: "8 Min",
    expert: "Master Tech V. Ray",
    img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    category: 'Energy',
    title: "The Zero-Loss Initiative: Eco-Logic Cooling",
    desc: "Transitioning to R-32 refrigerants and variable speed compressors for a greener, colder future. The roadmap to carbon neutral cooling.",
    date: "Oct 19, 2026",
    readTime: "10 Min",
    expert: "S. Kapoor, Lead Engineer",
    img: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    category: 'Residential',
    title: "Smart Air: Integrating AI with Home HVAC",
    desc: "How predictive cooling algorithms are learning your lifestyle to deliver 100% comfort with 40% less energy waste.",
    date: "Oct 15, 2026",
    readTime: "7 Min",
    expert: "N. Tesla Jr.",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    category: 'Industry',
    title: "Future Forecast: The Next Decade of HVAC",
    desc: "Magnetic refrigeration and solid-state cooling are on the horizon. What to expect in the 2030 ArcticFresh product line.",
    date: "Oct 10, 2026",
    readTime: "15 Min",
    expert: "Chief Strategy Officer",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    category: 'Commercial',
    title: "Safe-Breath Protocols for Public Spaces",
    desc: "Implementing HEPA-grade filtration in commercial AC units to ensure microbial-free air in high-traffic urban environments.",
    date: "Oct 05, 2026",
    readTime: "9 Min",
    expert: "Biosafety Division",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
  }
];
