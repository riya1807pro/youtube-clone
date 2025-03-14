import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "./ui/drawer";
import { Dialog, DialogHeader, DialogTitle } from "./ui/dialog";

interface ResponseModelProps {
    children: ReactNode;
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
}

export const ResponsiveMode = ({
    children,
    open,
    title,
    onOpenChange
}:ResponseModelProps)=>{
    const mobile = useIsMobile();

    if(mobile){
        return(
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {title}
                        </DrawerTitle>
                    </DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        )
    }
         return(
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogHeader>
                    <DialogHeader>
                        <DialogTitle>
                            {title}
                        </DialogTitle>
                    </DialogHeader>
                    {children}
                </DialogHeader>
            </Dialog>
        )
    

}