import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  name: string;
  description: string;
  port: string;
  icon: LucideIcon;
  color: string;
  ipAddress: string;
  protocol?: string;
  path?: string;
}

export const ServiceCard = ({ 
  name, 
  description, 
  port, 
  icon: Icon, 
  color,
  ipAddress,
  protocol = "http",
  path = ""
}: ServiceCardProps) => {
  const handleClick = () => {
    if (!ipAddress) {
      return;
    }
    const url = `${protocol}://${ipAddress}:${port}${path}`;
    window.open(url, '_blank');
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    if (e.button === 1 && ipAddress) { // Botón del medio (scroll wheel click)
      e.preventDefault();
      const url = `${protocol}://${ipAddress}:${port}${path}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Card
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105",
        "bg-card border-border hover:border-primary/50",
        "hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]",
        !ipAddress && "opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-none"
      )}
    >
      <div className="p-6 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div 
            className={cn(
              "p-3 rounded-lg transition-all duration-300 group-hover:scale-110",
              color
            )}
          >
            <Icon className="w-6 h-6 text-background" />
          </div>
          <div className="text-xs font-mono text-muted-foreground bg-muted px-2 py-1 rounded">
            :{port}
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300",
        color
      )} />
    </Card>
  );
};
