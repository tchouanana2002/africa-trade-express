import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Shield,
  Truck,
  Settings
} from 'lucide-react';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import VendorDashboard from '@/components/dashboards/VendorDashboard';
import CustomerDashboard from '@/components/dashboards/CustomerDashboard';
import DeliveryDashboard from '@/components/dashboards/DeliveryDashboard';
import Navbar from '@/components/Navbar';

type UserRole = 'admin' | 'vendor' | 'customer' | 'delivery_agent';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole>('customer');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setProfile(profileData);

        // Fetch user role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (roleData) {
          setUserRole(roleData.role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your dashboard.
            </p>
            <Button asChild>
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-5 w-5" />;
      case 'vendor':
        return <Package className="h-5 w-5" />;
      case 'delivery_agent':
        return <Truck className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'vendor':
        return 'default';
      case 'delivery_agent':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'vendor':
        return <VendorDashboard />;
      case 'delivery_agent':
        return <DeliveryDashboard />;
      default:
        return <CustomerDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar/>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              {/* <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {profile?.display_name || user.email}
              </h1> */}
              {/* <p className="text-muted-foreground mt-1">
                Manage your AfriMarket experience
              </p> */}
            </div>
            <Badge variant={getRoleColor(userRole)} className="flex items-center gap-2">
              {getRoleIcon(userRole)}
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>

        {/* Dashboard Content */}
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;