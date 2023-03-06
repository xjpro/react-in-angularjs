import type { IModule } from "angular";
import type React from "react";

export function getService<T>(name: string): T | Record<never, never>;

export function angularize(Component: React.Element, componentName: string, angularApp: IModule, bindings?: Record<string, string>): void;

export function angularizeDirective(Component: React.Element, directiveName: string, angularApp: IModule, bindings?: Record<string, string>): void;