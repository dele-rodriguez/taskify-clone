import {startCase} from "lodash";
import OrgControl from "./[organizationId]/_components/org-control";
import { auth } from "@clerk/nextjs/server";

export async function generateMetadata() {
    const { orgSlug } = auth();

    return {
        title: startCase(orgSlug || "organization"),
    };
}

function OrganizationIdLayout({children,}:{children: React.ReactNode;}) {
    return(
        <div className="w-full">
            <OrgControl />
            {children}
        </div>
    );
}

export default OrganizationIdLayout;