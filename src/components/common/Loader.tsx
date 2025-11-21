import { Loader2 } from "lucide-react";

const Loader = ({ text = "Loading..." }: { text?: string }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">{text}</p>
        </div>
    );
};

export default Loader;
