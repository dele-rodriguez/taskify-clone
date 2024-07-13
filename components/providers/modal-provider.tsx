"use client";
import { CardModal } from "@/components/modals/card-modal";
import { useEffect, useState } from "react";
import { ProModal } from "@/components/modals/pro-modal";

 

export function ModalProvider() {
    const [ isMounted , setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    } , []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CardModal />
            <ProModal />
        </>
    )
}