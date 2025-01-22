import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <nav className="w-full py-4 px-6 flex justify-between items-center border-b">
      <div className="text-xl font-semibold text-primary">MyApp</div>
      <div className="space-x-4">
        <Button variant="ghost">About</Button>
        <Button variant="ghost">Features</Button>
        <Button variant="ghost">Contact</Button>
      </div>
    </nav>
  );
};

export default Navbar;