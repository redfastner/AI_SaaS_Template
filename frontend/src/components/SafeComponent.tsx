"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
  name: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class SafeComponent extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in ${this.props.name}:`, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border-2 border-red-500 bg-red-50 rounded-2xl text-red-900">
          <h2 className="font-bold">Module Failed: {this.props.name}</h2>
          <p className="text-xs mt-2 font-mono">{this.state.error?.message}</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-900 text-white rounded-full text-[10px] font-bold uppercase"
          >
            Retry Module
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}