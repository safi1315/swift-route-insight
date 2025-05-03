
import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import MainSidebar from '@/components/Sidebar';
import StatCards from '@/components/StatCards';
import SpeedChart from '@/components/SpeedChart';
import DriversTable from '@/components/DriversTable';
import RegionFilter from '@/components/RegionFilter';
import DriverMap from '@/components/DriverMap';
import ChatBot from '@/components/ChatBot';
import { RefreshCw, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateMockDriverData, updateMockData, DriverData, regions } from '@/lib/mockData';

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>(regions[0]);
  const [driverData, setDriverData] = useState<DriverData[]>([]);
  const [filteredData, setFilteredData] = useState<DriverData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize data
  useEffect(() => {
    const initialData = generateMockDriverData(30);
    setDriverData(initialData);
    setLoading(false);
    
    // Set up periodic updates to simulate real-time data
    const interval = setInterval(() => {
      setDriverData(prev => updateMockData(prev));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter data when region selection changes
  useEffect(() => {
    if (selectedRegion === "All Regions") {
      setFilteredData(driverData);
    } else {
      setFilteredData(driverData.filter(driver => driver.region === selectedRegion));
    }
  }, [selectedRegion, driverData]);

  // Set up chat toggle functionality
  useEffect(() => {
    const chatToggle = document.getElementById('chat-toggle');
    if (chatToggle) {
      chatToggle.addEventListener('click', () => setChatOpen(true));
    }
    
    return () => {
      if (chatToggle) {
        chatToggle.removeEventListener('click', () => setChatOpen(true));
      }
    };
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const refreshedData = updateMockData(driverData);
      setDriverData(refreshedData);
      setLoading(false);
      toast({
        title: "Data Refreshed",
        description: "The dashboard has been updated with new data.",
      });
    }, 1000);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <MainSidebar />
        
        <div className="flex-1 container py-6">
          <div className="flex flex-col gap-6 fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Fleet Analytics Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor real-time performance and status of your fleet
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <RegionFilter 
                  selectedRegion={selectedRegion}
                  onRegionChange={setSelectedRegion}
                />
                
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => setChatOpen(true)}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Assistant
                </Button>
                
                <SidebarTrigger />
              </div>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <StatCards driverData={filteredData} />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <SpeedChart driverData={filteredData} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <DriverMap driverData={filteredData} />
                </div>
                
                <div className="mt-4">
                  <DriversTable driverData={filteredData} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ChatBot Dialog */}
        <ChatBot open={chatOpen} onOpenChange={setChatOpen} />
      </div>
    </SidebarProvider>
  );
};

export default Index;
