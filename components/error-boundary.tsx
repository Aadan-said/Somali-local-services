"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/lib/logger";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        logger.error("Uncaught error in Web application:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
                    <div className="max-w-md w-full space-y-6">
                        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-10 w-10 text-red-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-gray-900">Khalad ayaa dhacay</h2>
                            <p className="text-gray-500">Barnaamijku wuu is-taagay. Fadlan isku day inaad dib u cusboonaysiiso bogga.</p>
                        </div>
                        <Button
                            onClick={() => window.location.reload()}
                            className="font-bold gap-2"
                        >
                            <RefreshCcw className="h-4 w-4" />
                            Dib u raru bogga
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
