const HOOK_CAN_LOAD = "canLoad";
const HOOK_LOAD = "load";
const HOOK_LOAD_COMPLETE = "loadComplete";
const HOOK_ATTACHED = "attached"
const HOOK_BINDED ="binded";
const HOOK_CAN_UNLOAD = "canUnload";


/**
 * View Model lifeycle helper 
 * 
 * @export
 * @class LifeCycler
 */
export class LifeCycler{

    /**
     * Calls the "canLoad" hook
     * 
     * @static
     * @param {*} instance View Model instance 
     * @returns {Promise<any>}
     */
    public static callCanLoadHook(instance:any, data?:any):Promise<any>{
        return LifeCycler.callHook(instance,HOOK_CAN_LOAD,data);
    }

    /**
     * Calls the "load" hook
     * 
     * @static
     * @param {*} instance View Model instance 
     * @returns {Promise<any>}
     */
    public static callLoadHook(instance: any, data?: any): Promise<any> {        
        return LifeCycler.callHook(instance, HOOK_LOAD,data);
    }

    /**
     * Calls the "loadComplete" hook
     * 
     * @static
     * @param {*} instance View Model instance 
     * @returns {Promise<any>}
     */
    public static callLoadCompleteHook(instance: any): Promise<any> {
        return LifeCycler.callHook(instance, HOOK_LOAD_COMPLETE);
    }
    
    /**
     * Calls the "attached" hook
     * 
     * @static
     * @param {*} instance View Model instance 
     * @returns {Promise<any>}
     */
    public static callAttachedHook(instance: any): Promise<any> {
        return LifeCycler.callHook(instance, HOOK_ATTACHED);
    }

    /**
     * Calls the "binded" hook
     * 
     * @static
     * @param {*} instance View Model instance 
     * @returns {Promise<any>}
     */
    public static callBindedHook(instance: any): Promise<any> {

        return LifeCycler.callHook(instance, HOOK_BINDED);

    }

    /**
     * Calls the "canUnload" hook
     * 
     * @static
     * @param {*} instance View Model instance 
     * @returns {Promise<any>}
     */
    public static callCanUnloadHook(instance:any):Promise<any>{
        return LifeCycler.callHook(instance,HOOK_CAN_UNLOAD);
    }

     /**
      * Calls a given hook for a given parameter
      * 
      * @private
      * @static
      * @param {*} instance View Model instance
      * @param {string} hookName Hook name
      * @param {*} [hookData] Hook Data
      * @returns
      */
     private static callHook(instance: any, hookName: string, data?: any) {
        let hook = instance[hookName];
        if (hook)
            return Promise.resolve(hook.call(instance, data));                    
        else
            return Promise.resolve(true);            
    }
}
