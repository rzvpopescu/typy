/**
 * Meta property helper/handler class 
 * 
 * @export
 * @class MetaHelper
 */
export class MetaHelper{

    /**
     *  Creates a meta property on an instance for a given name and a value
     * 
     * @static
     * @param {*} instance The instance
     * @param {string} metaPropertyName Meta property name
     * @param {*} [metaPropertyValue] Meta property value
     */
    static setMetaProperty(instance:any,metaPropertyName:string,metaPropertyValue?:any){

        let metaKey = MetaHelper.getMetaPropertyKey(metaPropertyName);

        instance[metaKey] = metaPropertyValue;
        
    }

    
    /**
     * Returns a meta property for a given instance and a meta prop name 
     * 
     * @static
     * @param {*} instance The instance
     * @param {string} metaPropertyName The prop name
     */
    static getMetaProperty(instance:any,metaPropertyName:string){

        let metaKey = MetaHelper.getMetaPropertyKey(metaPropertyName);

        return instance[metaKey];

    }

    
    /**
     * Build a meta property key for a given meta prop name 
     * 
     * @private
     * @static
     * @param {string} metaPropertyName
     * @returns
     */
    private static getMetaPropertyKey(metaPropertyName:string){
        return `__${metaPropertyName}__`;
    }

}