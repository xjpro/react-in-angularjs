declare module 'react-in-angularjs' {
    import React from "react";

    function getService(name: string): any;

    function angularize(Component: React.Element, componentName: string, angularApp: any, bindings: any): void;

    function angularizeDirective(Component: React.Element, directiveName: string, angularApp: any, bindings: any): void;
}
