import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
}

const ErrorState = ({
    title = "Something went wrong",
    message = "We couldn't fetch the data. Please try again.",
    onRetry
}: ErrorStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 text-center p-4">
            <div className="bg-destructive/10 p-4 rounded-full">
                <AlertTriangle className="h-10 w-10 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="text-muted-foreground max-w-sm">{message}</p>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="mt-4">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorState;
