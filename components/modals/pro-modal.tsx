"use client" ;

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";
import { defaultImages } from "@/constants/images";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export function ProModal() {
    const [isLoading , setIsLoading] = useState<boolean>(false);
    const [subscribers , setSubscribers] = useState();
    const proModal = useProModal();

    const handleSuscribe = async() => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/paystack/suscribe" , {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
            });
        
            const data = await response.json();
        
            if(response.ok) {
                if (typeof window !== 'undefined') {
                    window.location.href = data.checkout_url;
                }
            } else {
                console.error(data);
                toast.error(data);
            }
        } catch(e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const fetchSubscribers = async () => {
        setIsLoading(true);
        try {
          const response = await fetch("/api/paystack/subscribers", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
    
          const data = await response.json();
    
          if (response.ok) {
            setSubscribers(data);
            toast.success("Fetched subscribers successfully");
          } else {
            console.error(data);
            toast.error(data.error);
          }
        } catch (e) {
          console.error("Error fetching subscribers:", e);
        } finally {
          setIsLoading(false);
        }
      };
    

    return (
        <Dialog
            open={proModal.isOpen}
            onOpenChange={proModal.onClose}
        >
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center">
                    <Image
                        src={defaultImages[9].urls.full}
                        alt="Hero"
                        className=" object-cover"
                        fill
                    />
                </div>
                <div className="text-neutral-700 mx-auto space-y-6 p-6">
                    <h2 className=" font-semibold text-xl">Upgrade to Taskify Pro Today</h2>
                    <p>Explore the best of Taskify</p>
                    <div className=" pl-3">
                        <ul className=" text-sm list-disc">
                            <li>Unlimited Boards</li>
                            <li>Advanced Checklist</li>
                            <li>Admin and security features</li>
                            <li>And more!!!</li>
                        </ul>
                    </div>
                    <Button 
                        className="w-full" 
                        variant="primary"
                        onClick={handleSuscribe}
                        disabled={isLoading}
                    >
                        Upgrade
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}