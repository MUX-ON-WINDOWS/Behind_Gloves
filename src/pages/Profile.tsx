
import { Layout } from "@/components/Layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Mail, MapPin, Phone, User } from "lucide-react";

const Profile = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src="/placeholder.svg" alt="Goalkeeper" />
              <AvatarFallback>GK</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Alex Morgan</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Badge variant="outline">Goalkeeper</Badge>
                <Badge variant="outline">FC United</Badge>
                <Badge variant="outline">#1</Badge>
              </div>
            </div>
          </div>
          <Button className="w-full md:w-auto">
            <Edit className="mr-2 h-4 w-4" /> Edit Profile
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p>Alex James Morgan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p>Manchester, United Kingdom</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>alex.morgan@fcunited.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p>+44 7123 456789</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Player Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Height</p>
                    <p className="font-medium">6'2" (188 cm)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">185 lbs (84 kg)</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">27</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nationality</p>
                    <p className="font-medium">British</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <p className="font-medium">August 2021</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Contract Until</p>
                    <p className="font-medium">June 2026</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferred Hand</p>
                  <p className="font-medium">Right</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Career Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Appearances</p>
                  <p className="text-2xl font-bold">158</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Clean Sheets</p>
                  <p className="text-2xl font-bold text-keeper-green">63</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Save Percentage</p>
                  <p className="text-2xl font-bold text-keeper-blue">76.4%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Penalties Saved</p>
                  <p className="text-2xl font-bold text-keeper-green">11</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="mb-4 grid grid-cols-4 md:w-auto">
            <TabsTrigger value="stats">Statistics</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="medical">Medical</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
                <CardDescription>Performance across all competitions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="text-center">
                      <p className="text-3xl font-bold">28</p>
                      <p className="text-sm text-muted-foreground mt-1">Games Played</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-keeper-green">12</p>
                      <p className="text-sm text-muted-foreground mt-1">Clean Sheets</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-keeper-red">23</p>
                      <p className="text-sm text-muted-foreground mt-1">Goals Conceded</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-keeper-blue">79.2%</p>
                      <p className="text-sm text-muted-foreground mt-1">Save Rate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Additional Stats</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex justify-between border-b pb-2">
                        <span>Penalties Faced</span>
                        <span>6</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Penalties Saved</span>
                        <span>2</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Catches</span>
                        <span>76</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Punches</span>
                        <span>24</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Sweeper Actions</span>
                        <span>32</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Accurate Long Balls</span>
                        <span>64%</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Passing Accuracy</span>
                        <span>88%</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Errors Leading to Goal</span>
                        <span>2</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="training">
            <Card>
              <CardHeader>
                <CardTitle>Training Data</CardTitle>
                <CardDescription>Recent training performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Training statistics and performance metrics will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="medical">
            <Card>
              <CardHeader>
                <CardTitle>Medical Records</CardTitle>
                <CardDescription>Health and injury history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Medical records and injury history will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Career History</CardTitle>
                <CardDescription>Previous clubs and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>Career history and previous club information will be displayed here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Profile;
