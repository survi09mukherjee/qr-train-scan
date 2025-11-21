import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Search, Filter } from "lucide-react";

const ScanHistory = () => {
    const [searchTerm, setSearchTerm] = useState("");

    // Mock data
    const scans = [
        { id: 1, user: "John Doe", session: "Advanced React", time: "2024-03-20 10:15 AM", status: "Valid" },
        { id: 2, user: "Jane Smith", session: "Advanced React", time: "2024-03-20 10:18 AM", status: "Valid" },
        { id: 3, user: "Bob Johnson", session: "TypeScript Fundamentals", time: "2024-03-22 02:05 PM", status: "Invalid" },
        { id: 4, user: "Alice Brown", session: "Advanced React", time: "2024-03-20 10:20 AM", status: "Valid" },
        { id: 5, user: "Charlie Davis", session: "State Management", time: "2024-03-25 11:00 AM", status: "Valid" },
    ];

    const filteredScans = scans.filter(scan =>
        scan.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scan.session.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExport = (type: 'csv' | 'pdf') => {
        console.log(`Exporting as ${type}...`);
        // Mock export logic
        const blob = new Blob(["Mock Export Data"], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `scan-history.${type}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Scan History</h1>
                    <p className="text-muted-foreground">View and manage scan logs</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => handleExport('csv')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={() => handleExport('pdf')}>
                        <Download className="mr-2 h-4 w-4" />
                        Export PDF
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Scans</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search user or session..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Session</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredScans.map((scan) => (
                                <TableRow key={scan.id}>
                                    <TableCell className="font-medium">{scan.user}</TableCell>
                                    <TableCell>{scan.session}</TableCell>
                                    <TableCell>{scan.time}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${scan.status === 'Valid'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {scan.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredScans.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                        No scans found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ScanHistory;
