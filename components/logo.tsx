import { FaReact } from 'react-icons/fa';

export const Logo: React.FC = () => {
    return (
      <div className="flex items-center">
        <FaReact size={32} className="text-blue-500" />
        <span className="ml-2 text-xl font-bold text-white">YourAppName</span>
      </div>
    );
  };
export default Logo;