import {Route} from './Route'
/**
 * Router interface definition 
 * 
 * @interface IRouter
 */
export interface IRouter{
    
    /**
     * Returns the current router path; 
     * 
     * @type {string}
     */
    currentRoute:Route;
    /**
     * The routes of the array
     * 
     * @type {Array<Route>}
     */
    routes:Array<Route>;
        
    /**
     * Router navigation steps 
     */
    navigationSteps:Array<(route:Route,data?:any)=>Promise<boolean>>;
    
    /**
     * Adds a navigation step to the navigation steps collection
     * 
     * @param {(route:Router,data?:any)=>Promise<boolean>} step
     */
    addNavigationStep(step:(route:Route,data?:any)=>Promise<boolean>):void;

    /**
     * Navigates to the given path
     * 
     * @param {string} path
     * @param {*} [data]
     * @returns {Promise<boolean>}
     */
    navigate(path:string,data?:any):Promise<boolean>;

    /**
     * Callback called before navigating to a route 
     * 
     * @param {(route:Route,data?:any)=>Promise<any>} callback
     * @returns {Promise<boolean>}
     */
    onNavigate(callback:(componentPath:string,data?:any)=>Promise<any>):void;

    /**
     * Navigates one route back
     * 
     * @param {*} [data]
     * @returns {Promise<boolean>}
     */
    navigateBack(data?:any):Promise<boolean>;
}