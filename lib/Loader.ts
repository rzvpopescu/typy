import {Logger} from './Logger';

/**
 * Helper for loading resuources
 * 
 * @export
 * @class Loader
 */
export class Loader {
    
    /**
     * The resources collection
     * 
     * @private
     * @static
     */
    private static cachedResources = new Map();
    
    /**
     * Loads and returns the protototype of a JS resource
     * 
     * @static
     * @param {string} resourcePath
     * @returns {Promise<any>}
     */
    public static getScriptResource(resourcePath:string):Promise<any>{   
        let preareResourceFn = (res:any):any=>{
            return res && res.default ?  res.default: res;
        }
        return this.getResource(resourcePath,preareResourceFn);           
    }

    /**
     *  Loads and returns the content of a HTML file
     * 
     * @static
     * @param {string} resourcePath
     * @returns {Promise<any>}
     */
    public static getHTMLResource(resourcePath:string):Promise<any>{        
        return this.getResource(resourcePath+'.html!text');
    }

    /**
     * Gets and returns a resource for a given path.
     * 
     * @private
     * @static
     * @param {string} resourcePath The path of the resource
     * @param {Function} [prepareResourceFn] Post get resource preparation callback
     * @returns {Promise<any>}
     */
    private static getResource(resourcePath:string,prepareResourceFn?:Function):Promise<any>{
        return this.getCachedResource(resourcePath).catch(err=>{           
           Logger.logInfo(`Loading resource << ${resourcePath} >> .`);
            return System.import(resourcePath).then(res=>{                
                var resourceValue = prepareResourceFn ? prepareResourceFn(res) : res;
                return resourceValue ? this.setCachedResource(resourcePath,resourceValue) : Promise.reject(`Invalid resource at path ${resourcePath}`);                                    
            }).catch(err=>{
                Logger.logError(`Loading resource error << ${err} >> . Resource path : ${resourcePath} .`);
                return Promise.reject(`Invalid resource at path ${resourcePath}`);
            });
        });       
    }

    /**
     * Gets and returns a already loaded resource
     * 
     * @private
     * @static
     * @param {string} resourcePath
     * @returns {*}
     */
    private static getCachedResource(resourcePath:string):Promise<any>{
        let resource = this.cachedResources.get(resourcePath);        
        return resource ? Promise.resolve(resource):Promise.reject(`Could not find the cached resource for ${resourcePath} path .`);
    }

    /**
     * Adds a resource into cache 
     * 
     * @private
     * @static
     * @param {string} resourcePath
     * @param {*} resourceValue
     */
    private static setCachedResource(resourcePath:string,resourceValue:any):any{        
        this.cachedResources.set(resourceValue,resourcePath);        
        return resourceValue;
    }
}
