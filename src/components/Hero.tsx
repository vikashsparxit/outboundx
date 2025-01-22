import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto text-center px-6 fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to Your New App
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Start building something amazing with React, Tailwind CSS, and modern web technologies.
        </p>
        <div className="space-x-4">
          <Button size="lg" className="bg-primary hover:bg-primary/90">
            Get Started
          </Button>
          <Button size="lg" variant="outline">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Hero;