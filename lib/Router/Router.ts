import {Logger} from '../Logger';
import {IRouter} from './IRouter';
import {Route} from './Route';
import {IMatchResult, PathMatcher} from './Path';

export interface IRouteMatchResult extends IMatchResult {
    route: Route
}

/**
 * Creates a router instance
 * 
 * @class Router
 */
class Router implements IRouter {

    private lastRoute: Route = null;

    /**
     * Returns the current route component path; 
     * 
     * @type {string}
     */
    get currentRoute(): Route {

        return this.lastRoute;

    };

    /**
     * On navigate callbacks 
     * 
     * @private
     * @type {(modulePath:string,data?:any)}
     */
    private onNavigateCallbacks: Array<(modulePath: string, data?: any) => void> = new Array<(modulePath: string, data?: any) => void>();

    /**
     * The routes of the router 
     * 
     * @type {Array<Route>}
     */
    routes: Array<Route> = new Array<Route>();


    /**
     * Router navigations steps 
     */
    navigationSteps: Array<(route: Route, data?: any) => Promise<boolean>> = new Array<(route: Route, data?: any) => Promise<boolean>>();


    /**
     * Creates a Router instance
     */
    constructor(routes?: Array<Route>) {

        if (routes) {

            this.routes.concat(routes);

        }

        // initialize the url watcher
        this.initHashWatcher();
    }


    /**
     * Adds a route to the routes collection 
     * 
     * @param {Route} route
     */
    addRoute(route: Route) {

        if (route) {

            this.routes.push(route);

        }
    }

    /**
     * Adds a navigation step to the navigation steps collection
     * 
     * @param {(route:Router,data?:any)=>Promise<boolean>} step
     */
    addNavigationStep(step: (route: Route, data?: any) => Promise<boolean>): void {

        this.navigationSteps.push(step);

    }

    /**
     * Navigates to the given path
     */
    navigate(path: string, data?: any): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            let bestMatch = this.findBestMatchingRoute(path);

            if (!bestMatch.isSuccess) {
                resolve(false);
            } else {
                let allData = Object.assign({}, bestMatch.data, data);
                this.navigateToRoute(bestMatch.route, allData);
                resolve(true);
            }
        });
    }

    private findBestMatchingRoute(path: string): IRouteMatchResult {
        let pathMatcher = new PathMatcher(path);

        let bestMatch: IMatchResult = null;

        let bestRoute: Route = null;

        this.routes.forEach((route) => {
            let match = route.matches(pathMatcher);
            if (!bestMatch || bestMatch.score < match.score) {
                bestMatch = match;
                bestRoute = route;
            }
        });

        let result = <IRouteMatchResult>bestMatch;
        result.route = bestRoute;

        return result;
    }

    /**
     *  Navigates to current route
    */
    public navigateToCurrentRoute() {

        let path = window.location.hash.replace('#', '');

        this.navigate(path);
    }


    /**
     * Adds a callback for routing
     * 
     * @param {(componentPath:string,data?:any)=>Promise<any>} callback
     * @returns {Promise<boolean>}
     */
    onNavigate(callback: (componentPath: string, data?: any) => Promise<any>): void {

        this.onNavigateCallbacks.push(callback);

    }


    /**
     * Navigates one route back
     * 
     * @param {*} [data]
     * @returns {Promise<boolean>}
     */
    navigateBack(data?: any): Promise<boolean> {

        return Promise.resolve(true);

    }


    /**
     * Watches the URL;
     * 
     * @private
     */
    private initHashWatcher() {

        window.onhashchange = () => this.navigateToCurrentRoute();

    }

    /**
     * Navigates to the specified route 
     * 
     * @private
     * @param {Route} route
     * @param {*} [data]
     */
    private navigateToRoute(route: Route, data?: any) {

        if (route) {

            this.callNavigationCallbacks(route.componentPath, data);

            this.resetActiveRoutes();

            route.isActive = true;

            this.setTitle(route.title);

            this.lastRoute = route;

        }
    }

    /**
     * Resets the isActive property on every route 
     * 
     * @private
     */
    private resetActiveRoutes() {

        this.routes.forEach((route: Route) => {

            route.isActive = false;

        });

    }


    /**
     *  Calls the navigation steps for the router
     * 
     * @private
     * @param {Route} route
     * @param {*} [data]
     */
    private callNavigationSteps(route: Route, data?: any): Promise<boolean> {

        let stepsPromises = this.navigationSteps.map(callbackFn => {

            return Promise.resolve(callbackFn);

        });

        return Promise.all(stepsPromises).then((results: any) => {

            return true;

        });
    }


    /**
     * Calls the onNavigation callback functions 
     * 
     * @private
     * @param {string} componentPath
     * @param {*} [data]
     */
    private callNavigationCallbacks(componentPath: string, data?: any) {

        let navCallbacks = this.onNavigateCallbacks.map(nc => {

            return Promise.resolve(nc(componentPath, data));

        });

        Promise.all(navCallbacks);
    }


    /**
     * Sets the APP title accordingly to the given title 
     * 
     * @private
     * @param {string} routeTitle
     */
    private setTitle(routeTitle: string) {

        window.document.title = routeTitle;

    }

}
export {
IRouter,
Router,
Route
}