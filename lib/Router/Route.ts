import {Path, PathMatcher, IMatchResult} from './Path';

/**
 * Route
 * 
 * @class Route
 */
export class Route {

    public currentRoute: Route;

    /**
     * The url paths of the route 
     * 
     * @type {Array<string>}
     */
    public paths: Array<Path> = [];

    /**
     * The path of the component loaded by this route
     * 
     * @type {string}
     */
    public componentPath: string;

    /**
     * Title of the route
     * 
     * @type {string}
     */
    public title: string;

    /**
     * The custom data of the route
     * 
     * @type {*} The custom data of the workflow can be any user defined type
     */
    public metaData: any = {};

    /**
     * Returns the first path of the route 
     * 
     * @returns {string}
     */
    public path: string;

    /**
     * Indicates if te route is the active route 
     * 
     * @type {boolean}
     */
    public isActive: boolean;
    /**
     * Creates an instance of Route.
     * 
     * @param {Array<string>} paths The url paths of the route
     * @param {string} componentPath The component loaded by the router for given its route paths
     * @param {string} title The title of the route
     * @param {*} [metaData] The medata of the route
     */
    constructor(paths: Array<string> | string, componentPath: string, title: string, metaData?: any) {

        let pathsArray: Array<string> = typeof paths === 'string' ? [paths] : paths;

        this.path = '#' + pathsArray[0];

        pathsArray.forEach(path => {
            this.paths.push(Path.parsePath(path));
        });

        this.componentPath = componentPath;

        this.title = title;

        this.metaData = metaData;

    }

    public matches(pathMatcher: PathMatcher): IMatchResult {
        var bestMatch: IMatchResult = null;
        for (let i = 0; i < this.paths.length; i++) {
            var match = this.paths[i].match(pathMatcher);
            if (bestMatch === null || bestMatch.score < match.score)
                bestMatch = match;
        }
        return bestMatch;
    }
}