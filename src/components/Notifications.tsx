import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

const Notifications = () => {
    const notifications = [
        { id: 1, title: "New Session Created", time: "2 mins ago", read: false },
        { id: 2, title: "Scan Failed: Invalid QR", time: "1 hour ago", read: false },
        { id: 3, title: "Daily Report Ready", time: "5 hours ago", read: true },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                        <div className="flex justify-between w-full">
                            <span className={`font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                                {notification.title}
                            </span>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">{notification.time}</span>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                    View all notifications
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Notifications
