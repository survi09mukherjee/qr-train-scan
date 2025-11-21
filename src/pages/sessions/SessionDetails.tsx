import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const SessionDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold">Session Details</h1>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Advanced React Workshop</CardTitle>
                            <p className="text-muted-foreground">ID: {id || "SESSION-123"}</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>March 20, 2024</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>10:00 AM - 12:00 PM</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    <span>Conference Room A</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Users className="h-4 w-4" />
                                    <span>25 Participants</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">
                                    A deep dive into advanced React patterns, performance optimization, and state management.
                                    Suitable for intermediate to advanced developers.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Participants</h3>
                                <div className="border rounded-lg divide-y">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-3 flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                                                    U{i}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">User {i}</p>
                                                    <p className="text-xs text-muted-foreground">user{i}@example.com</p>
                                                </div>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Checked In</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Session QR Code</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm border">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SESSION-${id || '123'}`}
                                    alt="Session QR Code"
                                    className="w-48 h-48"
                                />
                            </div>
                            <p className="text-sm text-center text-muted-foreground">
                                Scan this code to check in to the session.
                            </p>
                            <Button variant="outline" className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Download QR
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SessionDetails;
