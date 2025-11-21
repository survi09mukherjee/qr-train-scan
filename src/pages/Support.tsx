import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";

const Support = () => {
    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-3xl font-bold">Support Center</h1>
                <p className="text-muted-foreground">How can we help you today?</p>
            </div>

            <Tabs defaultValue="faq" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                    <TabsTrigger value="contact">Contact</TabsTrigger>
                    <TabsTrigger value="privacy">Privacy</TabsTrigger>
                    <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>

                <TabsContent value="faq">
                    <Card>
                        <CardHeader>
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <CardDescription>Find answers to common questions.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible>
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>How do I scan a QR code?</AccordionTrigger>
                                    <AccordionContent>
                                        Navigate to the "Scan QR" page from the sidebar. Allow camera access if prompted, and point your camera at the QR code. Alternatively, you can upload a QR code image.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Can I view my scan history?</AccordionTrigger>
                                    <AccordionContent>
                                        Yes, you can view your scan history by going to the "Scan History" page (or "Logs" for admins). You can also filter and export your scan data.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-3">
                                    <AccordionTrigger>How do I change my password?</AccordionTrigger>
                                    <AccordionContent>
                                        Go to your "Profile" page. In the "Personal Information" section, you can update your details. Password change functionality will be available there.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="contact">
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us</CardTitle>
                            <CardDescription>Get in touch with our support team.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-5 w-5 text-primary" />
                                    <span>support@qrtrainscan.com</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span>+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span>123 Tech Street, Silicon Valley, CA</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <label htmlFor="subject">Subject</label>
                                    <Input id="subject" placeholder="I need help with..." />
                                </div>
                                <div className="grid gap-2">
                                    <label htmlFor="message">Message</label>
                                    <Textarea id="message" placeholder="Describe your issue..." />
                                </div>
                                <Button className="w-full">Send Message</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Policy</CardTitle>
                            <CardDescription>Last updated: March 2024</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>
                                At QR Train Scan, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information.
                            </p>
                            <h3 className="font-semibold">Data Collection</h3>
                            <p>
                                We collect information you provide directly to us, such as when you create an account, update your profile, or use our services.
                            </p>
                            <h3 className="font-semibold">Data Usage</h3>
                            <p>
                                We use your information to provide, maintain, and improve our services, and to communicate with you.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about">
                    <Card>
                        <CardHeader>
                            <CardTitle>About QR Train Scan</CardTitle>
                            <CardDescription>Our mission and vision.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>
                                QR Train Scan is a cutting-edge application designed to streamline attendance and session management using QR code technology.
                            </p>
                            <p>
                                Our mission is to simplify the process of tracking participation and managing training sessions for organizations of all sizes.
                            </p>
                            <p>
                                Built with modern web technologies, QR Train Scan offers a fast, reliable, and user-friendly experience.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Support;
