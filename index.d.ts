declare module '@incidentiq/react-in-angularjs' {
    import React from "react";

    function getService(name: string): any;

    function angularize(component: React.Element, componentName: string, angularApp: any, bindings: any, options?:any);
}