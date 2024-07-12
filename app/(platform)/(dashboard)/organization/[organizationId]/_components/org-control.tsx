"use client";

import {useEffect} from "react";
import { useParams } from "next/navigation";
import { useOrganizationList } from "@clerk/nextjs";

function OrgControl() {
    const params = useParams();
    const { setActive } = useOrganizationList();

    useEffect(() => {
        if(!setActive) return;

        setActive({
            organization: params.organizationID as string,
        });

    } , [setActive , params.OrganizationId]);

    return null;
}

export default OrgControl;