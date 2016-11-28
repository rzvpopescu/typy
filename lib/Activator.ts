import {Injector} from './Injector';
/**
 * Activates a viewmodel or a class
 * 
 * @export
 * @class Activator
 */
export class Activator{

    /**
     * 
     *  Activates a class
     * @static
     */
    static activate(classObj:Function){            
        let dependencies = Injector.getDependencies(classObj);        
        let instances = Array.prototype.map.call(dependencies,(dependency:any)=>{        
            let instance = Injector.resolveType(dependency);
            if(!instance){
                instance =  Activator.activate(dependency);
                Injector.registerInstance(dependency,instance);
            }
            return instance;
        });
        return Reflect.construct(classObj,instances);
    }

    /// TODO : GO in depth
    private static checkCircularRefferences(classObj:any,dependentClassObj:any){
        //let dependencies = Injector.getDependencies(classObj);
        let dependentDependencies:Function[] = Injector.getDependencies(dependentClassObj);
        if(dependentDependencies.indexOf(classObj) > 0)
            throw new Error("Circular dependecy detected for class  ");
                
    }

    
}