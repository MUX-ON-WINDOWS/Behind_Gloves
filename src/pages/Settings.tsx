import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/hooks/useTheme";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Bell, CloudLightning, Gauge, Lock, Save, Shield, User, Sun, Moon } from "lucide-react";
import { ClubTeamForm } from "@/components/ClubTeamForm";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme, systemTheme } = useTheme();

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

        <div className="space-y-6">
          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Settings
              </CardTitle>
              <CardDescription>
                Update your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Club Team Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Set your club team name. This will be used as the home team in match statistics.
                </p>
                <ClubTeamForm />
              </div>
              
              
            </CardContent>
          </Card>

          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Appearance
              </CardTitle>
              <CardDescription>
                Customize how Goalie Vision looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="theme-switch">Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      {theme === 'system' 
                        ? `Using system theme (${systemTheme})`
                        : 'Choose between light and dark mode'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      id="theme-switch"
                      checked={theme === 'dark'}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setTheme('dark');
                        } else {
                          setTheme('light');
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-theme">Use System Theme</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically match your system's theme
                    </p>
                  </div>
                  <Switch
                    id="system-theme"
                    checked={theme === 'system'}
                    onCheckedChange={(checked) => {
                      setTheme(checked ? 'system' : systemTheme);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
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
                      <Label htmlFor="push-comments">Performance Reports</Label>
                      <p className="text-sm text-muted-foreground">
                        Be notified when new performance analysis is available
                      </p>
                    </div>
                    <Switch id="push-comments" defaultChecked />
                  </div>
                </div>
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
                    <Switch id="marketing" defaultChecked/>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
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
              
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudLightning className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
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
          </Card>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
