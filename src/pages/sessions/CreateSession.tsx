import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateSession = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-3xl font-bold">Create New Session</h1>
            </div>

            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Session Details</CardTitle>
                    <CardDescription>Enter the details for the new training session.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Session Title</label>
                        <Input placeholder="e.g., Advanced React Workshop" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Date</label>
                            <Input type="date" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Time</label>
                            <Input type="time" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input placeholder="e.g., Conference Room A or Zoom Link" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea placeholder="Brief description of the session..." />
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                        <Button onClick={() => navigate("/sessions")}>Create Session</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateSession;
