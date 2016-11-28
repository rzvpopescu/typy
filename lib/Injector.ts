
import {Logger} from './Logger';

/**
 * Injects the dependency to the target class 
 * 
 * @param {...Array<Function>} injectionParameters
 * @returns
 */
function inject(...injectionParameters : Array<Function>) {
  return function applyDependencies(target : Function) : void {            
    Array.prototype.forEach.call(injectionParameters,(dependency:any)=>{
        Injector.setDependency(target,dependency);        
      });
    }
}

// The dependencies meta structure key
const DEPENDENCIES_PROPERTY :any = "__DEPENDENCIES__";

/**
 * DI utilities 
 * 
 * @class Injector
 */
class Injector{
  
  /**
   * The already injected objects cache 
   * 
   * @private
   * @static
   * @type {Map<any,any>}
   * @memberOf Injector
   */
  private static instancesMap : Map<any,any> =  new Map<any,any>();

   
  /**
   * Sets a dependecy for a given target
   * 
   * @static
   * @param {Function} classObj
   * @param {Function} dependency
   * 
   * @memberOf Injector
   */
  static setDependency(classObj:Function,dependency:Function){
    let deps = Injector.getDependencies(classObj);
    deps.push(dependency);
  }

  
  /**
   * Adds a instance to the instances cache
   * 
   * @static
   * @param {Function} classObj
   * @param {*} classInstance
   * 
   * @memberOf Injector
   */
  static registerInstance(classObj:Function,classInstance:any){
    Injector.instancesMap.set(classObj,classInstance);
  }


  /**
   * Gets and returns an instance for a given type
   * 
   * @static
   * @param {Function} classObj
   * @returns
   * 
   * @memberOf Injector
   */
  static resolveType(classObj:Function){
    return Injector.instancesMap.get(classObj);
  }

 
  /**
   * Gets and returns the dependencies of a given class
   * 
   * @static
   * @param {Function} classObj
   * @returns {Array<Function>}
   * 
   * @memberOf Injector
   */
  static getDependencies(classObj:Function):Array<Function>{        
    return (classObj as any)[DEPENDENCIES_PROPERTY] || 
          Injector.createDenpenciesProperty(classObj);
  }

  
  /**
   * 
   *  Creates the dependecies meta structure for a given class
   * @private
   * @static
   * @param {Function} classObj
   * @returns {Array<Function>}
   * 
   * @memberOf Injector
   */
  private static createDenpenciesProperty(classObj:Function):Array<Function>{
    (classObj as any)[DEPENDENCIES_PROPERTY] = Array<any>();
    return (classObj as any)[DEPENDENCIES_PROPERTY];
  }
}

export {
  inject,
  Injector
}