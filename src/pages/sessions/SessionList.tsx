import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const SessionList = () => {
    const sessions = [
        { id: 1, title: "Advanced React Workshop", date: "2024-03-20", time: "10:00 AM", participants: 25 },
        { id: 2, title: "TypeScript Fundamentals", date: "2024-03-22", time: "02:00 PM", participants: 18 },
        { id: 3, title: "State Management with Redux", date: "2024-03-25", time: "11:00 AM", participants: 30 },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Sessions</h1>
                    <p className="text-muted-foreground">Manage your training sessions</p>
                </div>
                <Button asChild>
                    <Link to="/sessions/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Session
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4">
                {sessions.map((session) => (
                    <Card key={session.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg">{session.title}</h3>
                                <div className="flex gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {session.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {session.time}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        {session.participants}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <Link to={`/sessions/${session.id}`}>
                                    <ChevronRight className="h-5 w-5" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SessionList;
