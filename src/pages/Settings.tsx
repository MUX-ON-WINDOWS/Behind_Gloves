
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Bell, CloudLightning, Gauge, Lock, Save, Shield, User } from "lucide-react";
import { ClubTeamForm } from "@/components/ClubTeamForm";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
        
        <Tabs defaultValue="account" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-5 h-auto md:w-auto md:h-10">
            <TabsTrigger value="account" className="text-xs md:text-sm">
              <User className="h-4 w-4 mr-1 md:mr-2" /> Account
            </TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs md:text-sm">
              <Gauge className="h-4 w-4 mr-1 md:mr-2" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs md:text-sm">
              <Bell className="h-4 w-4 mr-1 md:mr-2" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="text-xs md:text-sm">
              <Shield className="h-4 w-4 mr-1 md:mr-2" /> Security
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs md:text-sm">
              <CloudLightning className="h-4 w-4 mr-1 md:mr-2" /> Advanced
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Update your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="Alex" defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Morgan" defaultValue="Morgan" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="alex.morgan@fcunited.com" 
                      defaultValue="alex.morgan@fcunited.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teamRole">Team Role</Label>
                    <Input id="teamRole" placeholder="Goalkeeper" defaultValue="Goalkeeper" />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Club Team Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Set your club team name. This will be used as the home team in match statistics.
                  </p>
                  <ClubTeamForm />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email about your account activity
                        </p>
                      </div>
                      <Switch id="notifications" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and updates
                        </p>
                      </div>
                      <Switch id="marketing" />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how Goalie Vision looks on your device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Theme</h3>
                  <div className="flex flex-col gap-4 md:flex-row">
                    <Card className={`relative cursor-pointer w-full ${theme === 'light' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => setTheme('light')}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Light</h4>
                          {theme === 'light' && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 h-20 rounded-md bg-[#fff] border"></div>
                      </CardContent>
                    </Card>
                    <Card className={`relative cursor-pointer w-full ${theme === 'dark' ? 'border-primary' : 'border-muted'}`}
                      onClick={() => setTheme('dark')}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Dark</h4>
                          {theme === 'dark' && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="mt-4 h-20 rounded-md bg-slate-950 border border-slate-800"></div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Reset</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Push Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-all">Match Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications about upcoming matches and results
                        </p>
                      </div>
                      <Switch id="push-all" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-mentions">Training Schedule</Label>
                        <p className="text-sm text-muted-foreground">
                          Get reminders about training sessions and schedule changes
                        </p>
                      </div>
                      <Switch id="push-mentions" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-comments">Performance Reports</Label>
                        <p className="text-sm text-muted-foreground">
                          Be notified when new performance analysis is available
                        </p>
                      </div>
                      <Switch id="push-comments" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>
                  Manage your account security and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">
                        Enable two-factor authentication
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Enhance your account security with 2FA
                      </p>
                    </div>
                    <Button variant="outline" className="ml-auto flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      Setup <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>
                  Configure advanced settings for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="analytics">Analytics Data</Label>
                        <p className="text-sm text-muted-foreground">
                          Share anonymous usage data to help us improve
                        </p>
                      </div>
                      <Switch id="analytics" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="tracking">Performance Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable detailed performance tracking and analysis
                        </p>
                      </div>
                      <Switch id="tracking" defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Export Data</h3>
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Download all your performance data and history
                    </p>
                    <Button variant="outline" className="w-full md:w-auto">
                      Export Performance Data
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Danger Zone</h3>
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm text-muted-foreground">
                      This action cannot be undone. This will permanently delete your account.
                    </p>
                    <Button variant="destructive" className="w-full md:w-auto">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
