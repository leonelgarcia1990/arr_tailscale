import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { 
  Film, 
  Tv, 
  Radio, 
  Subtitles, 
  Download, 
  Container, 
  Heart, 
  Play, 
  Folder,
  Shield,
  Globe,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

const SERVICES = [
  {
    name: "Radarr",
    description: "Gestión de películas",
    port: "7878",
    icon: Film,
    color: "bg-tech-yellow",
    protocol: "http",
    path: ""
  },
  {
    name: "Sonarr",
    description: "Gestión de series",
    port: "8989",
    icon: Tv,
    color: "bg-tech-blue",
    protocol: "http",
    path: ""
  },
  {
    name: "Prowlarr",
    description: "Gestión de indexadores",
    port: "9696",
    icon: Radio,
    color: "bg-tech-orange",
    protocol: "http",
    path: ""
  },
  {
    name: "Bazarr",
    description: "Gestión de subtítulos",
    port: "6767",
    icon: Subtitles,
    color: "bg-tech-green",
    protocol: "http",
    path: ""
  },
  {
    name: "qBittorrent",
    description: "Cliente Torrent",
    port: "8080",
    icon: Download,
    color: "bg-tech-cyan",
    protocol: "http",
    path: ""
  },
  {
    name: "Portainer",
    description: "Gestión de Docker",
    port: "9443",
    icon: Container,
    color: "bg-tech-purple",
    protocol: "https",
    path: "/#!/home"
  },
  {
    name: "Jellyseerr",
    description: "Solicitudes de contenido",
    port: "5055",
    icon: Heart,
    color: "bg-tech-pink",
    protocol: "http",
    path: ""
  },
  {
    name: "Jellyfin",
    description: "Servidor multimedia",
    port: "8096",
    icon: Play,
    color: "bg-tech-red",
    protocol: "http",
    path: ""
  },
  {
    name: "Filebrowser",
    description: "Explorador de archivos",
    port: "8081",
    icon: Folder,
    color: "bg-tech-green",
    protocol: "http",
    path: ""
  },
  {
    name: "AdGuard Home",
    description: "Bloqueador DNS",
    port: "8088",
    icon: Shield,
    color: "bg-tech-blue",
    protocol: "http",
    path: ""
  },
  {
    name: "Transmission",
    description: "Cliente Torrent",
    port: "9091",
    icon: Download,
    color: "bg-tech-red",
    protocol: "http",
    path: ""
  },
  {
    name: "Firefox",
    description: "Navegador web",
    port: "5800",
    icon: Globe,
    color: "bg-tech-orange",
    protocol: "http",
    path: ""
  },
  {
    name: "WUD",
    description: "Docker Updater",
    port: "9090",
    icon: RefreshCw,
    color: "bg-tech-purple",
    protocol: "http",
    path: ""
  }
];

const Index = () => {
  const [inputValue, setInputValue] = useState("");
  const [activeIp, setActiveIp] = useState("192.168.100.43");

  useEffect(() => {
    const savedIp = localStorage.getItem("homelab-ip");
    if (savedIp) {
      setActiveIp(savedIp);
      // No mostrar la IP en el input, dejarlo vacío para pegar fácilmente
    } else {
      // Establecer IP por defecto en el background
      const defaultIp = "192.168.100.43";
      setActiveIp(defaultIp);
      localStorage.setItem("homelab-ip", defaultIp);
    }
  }, []);

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      setActiveIp(value);
      localStorage.setItem("homelab-ip", value);
      toast.success("Dirección IP guardada");
    } else {
      // Si borra el input, volver a la IP por defecto
      const defaultIp = "192.168.100.43";
      setActiveIp(defaultIp);
      localStorage.setItem("homelab-ip", defaultIp);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const isValidIp = activeIp.trim() !== "";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-card/50 backdrop-blur-sm border border-primary/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-tech-blue bg-clip-text text-transparent">
                Homelab Control Center
              </h1>
              <Button
                onClick={handleReload}
                size="icon"
                variant="ghost"
                className="ml-2 hover:bg-primary/20 transition-colors"
                title="Recargar página"
              >
                <RefreshCw className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto"> 
          </p>
        </div>

        {/* IP Input */}
        <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          <div className="relative">
            <Input
              type="text"
              placeholder="192.168.100.43 by Deafault or Paste your Tailscale ip"
              value={inputValue}
              onChange={handleIpChange}
              className="h-14 px-6 text-lg font-mono bg-card border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {isValidIp && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="w-3 h-3 rounded-full bg-tech-green animate-pulse" />
              </div>
            )}
          </div>
          {!isValidIp && (
            <p className="mt-3 text-sm text-muted-foreground text-center">
            </p>
          )}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
          {SERVICES.map((service, index) => (
            <div
              key={service.name}
              className="animate-in fade-in slide-in-from-bottom"
              style={{ animationDelay: `${300 + index * 50}ms` }}
            >
              <ServiceCard
                {...service}
                ipAddress={activeIp}
              />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
          <p>Designed by LeoncioBlues - 2025 - Version 2.2</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
