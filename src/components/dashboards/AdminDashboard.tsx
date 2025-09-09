import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Users, Package, TrendingUp, Shield, Settings, Trash2, Edit, Ban, CheckCircle, BarChart3, Activity } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  profiles: {
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    is_blocked: boolean | null;
  };
  user_roles: {
    role: 'admin' | 'vendor' | 'customer' | 'delivery_agent';
  }[];
}

interface Analytics {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalOrders: number;
  revenueThisMonth: number;
  ordersThisWeek: number;
}

interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  description: string | null;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Analytics>({
    totalUsers: 0,
    totalVendors: 0,
    totalCustomers: 0,
    totalOrders: 0,
    revenueThisMonth: 0,
    ordersThisWeek: 0
  });
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    first_name: '',
    last_name: '',
    role: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    fetchSettings();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get auth users first
      const { data: authUsers } = await supabase.auth.admin.listUsers();
      
      if (!authUsers?.users?.length) {
        setUsers([]);
        setStats({
          totalUsers: 0,
          totalVendors: 0,
          totalCustomers: 0,
          totalOrders: 0,
          revenueThisMonth: 0,
          ordersThisWeek: 0
        });
        return;
      }

      // Fetch profiles and roles for each user
      const enrichedUsers: User[] = [];
      
      for (const authUser of authUsers.users) {
        // Get profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        // Get user roles
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', authUser.id);

        enrichedUsers.push({
          id: authUser.id,
          email: authUser.email || '',
          created_at: authUser.created_at || '',
          profiles: {
            display_name: profile?.display_name || null,
            first_name: profile?.first_name || null,
            last_name: profile?.last_name || null,
            avatar_url: profile?.avatar_url || null,
            is_blocked: profile?.is_blocked || false
          },
          user_roles: userRoles || []
        });
      }

      setUsers(enrichedUsers);

      // Get orders stats
      const { data: orders, count: totalOrders } = await supabase
        .from('orders')
        .select('amount, created_at', { count: 'exact' });

      // Calculate revenue this month
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const revenueThisMonth = orders?.filter(order => 
        new Date(order.created_at) >= currentMonth
      ).reduce((sum, order) => sum + order.amount, 0) || 0;

      // Calculate orders this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const ordersThisWeek = orders?.filter(order => 
        new Date(order.created_at) >= oneWeekAgo
      ).length || 0;

      // Calculate stats
      const totalUsers = enrichedUsers.length;
      const totalVendors = enrichedUsers.filter(u => 
        Array.isArray(u.user_roles) && u.user_roles.some(r => r.role === 'vendor')
      ).length;
      const totalCustomers = enrichedUsers.filter(u => 
        Array.isArray(u.user_roles) && u.user_roles.some(r => r.role === 'customer')
      ).length;

      setStats({
        totalUsers,
        totalVendors,
        totalCustomers,
        totalOrders: totalOrders || 0,
        revenueThisMonth,
        ordersThisWeek
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data: settings } = await supabase
        .from('app_settings')
        .select('*')
        .order('setting_key');
      
      setSettings(settings || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditForm({
      display_name: user.profiles.display_name || '',
      first_name: user.profiles.first_name || '',
      last_name: user.profiles.last_name || '',
      role: user.user_roles[0]?.role || 'customer'
    });
    setIsEditing(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
        })
        .eq('user_id', selectedUser.id);

      if (profileError) throw profileError;

      // Update role if changed
      const currentRole = selectedUser.user_roles[0]?.role;
      if (currentRole !== editForm.role) {
        // Delete existing role
        if (currentRole) {
          await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', selectedUser.id);
        }

        // Insert new role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: selectedUser.id,
            role: editForm.role as 'admin' | 'vendor' | 'customer' | 'delivery_agent'
          });

        if (roleError) throw roleError;
      }

      toast({
        title: "Success",
        description: "User updated successfully",
      });

      setIsEditing(false);
      setSelectedUser(null);
      fetchDashboardData();

    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Delete from auth (this will cascade to profiles and user_roles)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      fetchDashboardData();

    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleBlockUser = async (userId: string, block: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_blocked: block })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: block ? "User Blocked" : "User Unblocked",
        description: `User has been ${block ? 'blocked' : 'unblocked'} successfully`,
      });

      fetchDashboardData();

    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
      toast({
        title: "Error",
        description: `Failed to ${block ? 'block' : 'unblock'} user`,
        variant: "destructive",
      });
    }
  };

  const updateSetting = async (key: string, value: any) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .update({ setting_value: value })
        .eq('setting_key', key);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });

      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendors</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVendors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue (Month)</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.revenueThisMonth.toLocaleString()} XAF</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders (Week)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.ordersThisWeek}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management ({users.length} users)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <h4 className="font-semibold">{user.profiles.display_name || user.email}</h4>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {user.user_roles[0]?.role || 'customer'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.profiles.is_blocked ? "destructive" : "default"}>
                          {user.profiles.is_blocked ? "Blocked" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant={user.profiles.is_blocked ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleBlockUser(user.id, !user.profiles.is_blocked)}
                          >
                            {user.profiles.is_blocked ? <CheckCircle className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this user? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Users</span>
                    <span className="font-bold">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendors</span>
                    <span className="font-bold">{stats.totalVendors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Customers</span>
                    <span className="font-bold">{stats.totalCustomers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Orders</span>
                    <span className="font-bold">{stats.totalOrders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue (This Month)</span>
                    <span className="font-bold">{stats.revenueThisMonth.toLocaleString()} XAF</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Orders (This Week)</span>
                    <span className="font-bold">{stats.ordersThisWeek}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Activity Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.totalCustomers}</div>
                  <div className="text-sm text-muted-foreground">Active Customers</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalVendors}</div>
                  <div className="text-sm text-muted-foreground">Active Vendors</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Total Orders</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {settings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                      <p className="text-sm text-muted-foreground">{setting.description}</p>
                    </div>
                    <div className="w-48">
                      {setting.setting_key === 'maintenance_mode' ? (
                        <Switch
                          checked={setting.setting_value === true}
                          onCheckedChange={(checked) => updateSetting(setting.setting_key, checked)}
                        />
                      ) : setting.setting_key.includes('amount') ? (
                        <Input
                          type="number"
                          value={setting.setting_value}
                          onChange={(e) => updateSetting(setting.setting_key, parseInt(e.target.value))}
                          className="w-full"
                        />
                      ) : (
                        <Input
                          value={typeof setting.setting_value === 'string' ? setting.setting_value.replace(/"/g, '') : setting.setting_value}
                          onChange={(e) => updateSetting(setting.setting_key, `"${e.target.value}"`)}
                          className="w-full"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Database Status</span>
                  <Badge variant="default">Connected</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup</span>
                  <span className="text-sm text-muted-foreground">Automatic</span>
                </div>
                <div className="flex justify-between">
                  <span>App Version</span>
                  <span className="text-sm">1.0.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      {isEditing && selectedUser && (
        <AlertDialog open={isEditing} onOpenChange={setIsEditing}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Edit User</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={editForm.display_name}
                  onChange={(e) => setEditForm({...editForm, display_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={editForm.role} onValueChange={(value) => setEditForm({...editForm, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="delivery_agent">Delivery Agent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsEditing(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleUpdateUser}>Save Changes</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default AdminDashboard;