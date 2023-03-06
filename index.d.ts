import type { IModule } from "angular";
import type React from "react";

declare module 'react-in-angularjs' {

    function getService(name: string): any;

    function angularize(Component: React.Element, componentName: string, angularApp: IModule, bindings?: Record<string, string>): void;

    function angularizeDirective(Component: React.Element, directiveName: string, angularApp: IModule, bindings?: Record<string, string>): void;
}