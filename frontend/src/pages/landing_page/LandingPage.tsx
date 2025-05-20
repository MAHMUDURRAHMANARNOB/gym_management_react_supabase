import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/nfg.jpg';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const classes = [
    { name: 'Strength Training', description: 'Build muscle and increase strength with expert-led weightlifting routines.', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },
    { name: 'High-intensity interval training', description: 'Boost your cardiovascular endurance and burn calories with high-energy interval workouts.', image: 'https://images.unsplash.com/photo-1639496908117-6633c4aa9592?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Flexibility and Balance Workouts', description: 'Improve your flexibility, stability, and balance with guided yoga and stretching exercises.', image: 'https://images.unsplash.com/photo-1680155167222-b4931a0e5163?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Bodyweight Workouts', description: 'Build strength and endurance using your own body weight for a full-body workout.', image: 'https://images.unsplash.com/photo-1734188341701-5a0b7575efbe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Functional Training', description: 'Enhance everyday movements and overall fitness with exercises that mimic real-life activities."', image: 'https://images.unsplash.com/photo-1536922246289-88c42f957773?q=80&w=1504&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { name: 'Yoga Flow', description: 'Improve flexibility, strength, and mindfulness through a dynamic sequence of yoga poses.', image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80' },

];

  const trainers = [
    { name: 'Rakib Hossain', role: 'Coach', image: 'https://scontent.fdac19-1.fna.fbcdn.net/v/t39.30808-6/476252230_1341688133951254_9041440622828374949_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=86c6b0&_nc_eui2=AeHoH6MXlmuNG69-27qcWt2ip_MT_9Hyycun8xP_0fLJy-nYjvJht4vJ21v9r1Fxtwn73D3fc8QxE5Vu7s307DBo&_nc_ohc=JHL-4lXEkkAQ7kNvwGa3t6T&_nc_oc=AdmeAfSXUI291vWz_ifDjzwR-tOVj9hoSYbvyZfFdeG8CXp3cnxEH6GJQuEyjXj3Kag&_nc_zt=23&_nc_ht=scontent.fdac19-1.fna&_nc_gid=hSoRLecD4yh2YufNSwbdtg&oh=00_AfJzKW0kUEc5qxHGvubJxqKCrtWGGiIM9u3miVLD3on7FA&oe=682F6F4B' },
    
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmail = () => {
    const adminEmail = 'gym-admin@example.com'; // Replace with your admin email
    const subject = `Contact Form Submission from ${formData.name}`;
    const body = `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    window.location.href = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleWhatsApp = () => {
    const phoneNumber = '+8801686006304'; // Replace with your WhatsApp number (e.g., +1-234-567-8900)
    const message = `Name: ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Navbar */}
      <nav className="bg-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src={logo} alt="Natural Fitness Gym" className="h-10 w-auto" />
          </div>
          <div className="hidden md:flex space-x-6 items-center">
            <a href="#home" className="hover:text-gray-600 transition duration-300">Home</a>
            <a href="#programs" className="hover:text-gray-600 transition duration-300">Programs</a>
            <a href="#coaches" className="hover:text-gray-600 transition duration-300">Coaches</a>
            <a href="#about" className="hover:text-gray-600 transition duration-300">About</a>
            <a href="#contact" className="hover:text-gray-600 transition duration-300">Contact</a>
            <Button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300">
              Join Now
            </Button>
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={() => navigate('/login')}>
              Login
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6 text-black" /> : <Menu className="h-6 w-6 text-black" />}
            </Button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white p-4">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="hover:text-gray-600 transition duration-300" onClick={toggleMenu}>Home</a>
              <a href="#programs" className="hover:text-gray-600 transition duration-300" onClick={toggleMenu}>Programs</a>
              <a href="#coaches" className="hover:text-gray-600 transition duration-300" onClick={toggleMenu}>Coaches</a>
              <a href="#about" className="hover:text-gray-600 transition duration-300" onClick={toggleMenu}>About</a>
              <a href="#contact" className="hover:text-gray-600 transition duration-300" onClick={toggleMenu}>Contact</a>
              <Button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300" onClick={toggleMenu}>
                Join Now
              </Button>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={() => { navigate('/login'); toggleMenu(); }}>
                Login
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="home" className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-black opacity-75"></div>
        <div className="container mx-auto h-full flex flex-col justify-center items-center text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-4 text-white">Unleash Your Strength</h2>
          <p className="text-lg md:text-xl mb-6 text-white">Join Natural Fitness Gym and transform your body and mind.</p>
          <Button className="bg-black text-white px-6 py-3 rounded hover:bg-red-700">Join Now</Button>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-black">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {classes.map((cls, index) => (
              <Card key={index} className="bg-gray-100 border-none">
                <CardHeader>
                  <img src={cls.image} alt={cls.name} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2 text-black">{cls.name}</CardTitle>
                  <p className="text-gray-600">{cls.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches */}
      <section id="coaches" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-black">Meet Our Coaches</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer, index) => (
              <Card key={index} className="bg-gray-100 border-none">
                <CardHeader>
                  <img src={trainer.image} alt={trainer.name} className="w-full h-48 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl mb-2 text-black">{trainer.name}</CardTitle>
                  <p className="text-gray-600">{trainer.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-black">Why Choose Us?</h2>
          <p className="text-lg mb-6 text-black">Our gym provides everything you need for a complete workout experience.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-gray-100 border-none">
              <CardContent className="p-6">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Gym"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600">Discover how we’re transforming lives with advanced tools and personalized programs.</p>
              </CardContent>
            </Card>
            <div className="flex flex-col items-center justify-center">
              <ul className="text-left text-black mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">🏋️‍♂️</span> State-of-the-art equipment for all fitness levels.
                </li>
                <li className="flex items-center">
                  <span className="mr-2">🤝</span> A supportive community that motivates you to succeed.
                </li>
                <li className="flex items-center">
                  <span className="mr-2">📅</span> Flexible class schedules to fit your busy life.
                </li>
                <li className="flex items-center">
                  <span className="mr-2">💪</span> Expert trainers dedicated to your personal goals.
                </li>
              </ul>
              <Button className="bg-black text-white mt-4 hover:bg-gray-700">Learn More</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 text-black">Join the Movement</h2>
          <p className="text-lg mb-6 text-black">Ready to start your fitness journey? Get in touch today!</p>
          <Card className="max-w-md mx-auto bg-gray-100 border-none">
            <CardContent className="pt-6">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-lg text-black"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-lg text-black"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-lg text-black"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <div className="space-y-4">
                <Button className="bg-black text-white w-full hover:bg-gray-700" onClick={handleEmail}>
                  Send via Email
                </Button>
                <Button className="bg-black text-white w-full hover:bg-gray-700" onClick={handleWhatsApp}>
                  Send via WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-black">© 2025 Natural Fitness Gym. All rights reserved.</p>
          <div className="mt-2">
            <a href="#" className="hover:text-gray-600 mx-2 text-black">Privacy Policy</a>
            <a href="#" className="hover:text-gray-600 mx-2 text-black">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;