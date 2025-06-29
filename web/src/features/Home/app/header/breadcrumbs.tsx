"use client";

import { Icons } from "@/components/icon/icon";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import { Fragment } from "react";

export default function Breadcrumbs() {
    const items = useBreadcrumbs();
    if (items.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                    <Fragment key={index}>
                        {index !== items.length - 1 && (
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href={item.url}>
                                    {item.title}
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        )}
                        {index < items.length - 1 && (
                            <BreadcrumbSeparator className="hidden md:block">
                                <Icons.slash />
                            </BreadcrumbSeparator>
                        )}
                        {index === items.length - 1 && (
                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                        )}
                    </Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
