import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  label: string;
  Icon: LucideIcon;
  value: string | number;
}

const InfoCard = ({ label, Icon, value }: InfoCardProps) => {
  return (
    <div className="flex flex-col w-full md:w-1/4 bg-white shadow-sm rounded-2xl py-6 px-6 text-sm">
      <div className="text-gray-400 mb-2">{label}</div>
      <div className="flex space-x-2 items-center">
        <Icon size={16} />
        <span>{value}</span>
      </div>
    </div>
  );
};

export default InfoCard;
