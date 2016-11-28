
/**
 * Helper for expression manipulation 
 * 
 * @export
 * @class ExpressionEvaluator
 */
export class ExpressionsHelper {
    private static compiledFunctions: Map<string, Function> = new Map<string, Function>();

    /**
     * Parses a string function and returns the name,and parameters
     * 
     * @static
     * @param {string} functionString Function string
     * @returns {string[]} Elements of that function
     */
    static getFunctionItems(functionString: string): string[] {

        functionString = functionString.replace(';', '');

        return functionString.split(/[(),]/g).filter(Boolean);

    }

    /**
     * 
     * 
     * @static
     * @param {string} expression
     * @param {*} viewModel
     * @returns {*}
     */
    static getEvaluatedExpression(expression: string, viewModel: any): any {

        let evaluatedExpression = ExpressionsHelper.getCompiledFunction("_", "return _." + expression)(viewModel);

        return evaluatedExpression;

    }

    /**
     * 
     * 
     * @static
     * @param {string} expression
     * @param {*} viewModel
     * @returns
     */
    static getEvaluatedFunctionExpression(expression: string, viewModel: any) {

        let expressionFunction = ExpressionsHelper.getCompiledFunction("_", "event", "with(_) return _." + expression);

        return expressionFunction;

    }


    /**
     * Sets a meta property for a given property 
     * 
     * @static
     * @param {string} propertyName
     * @param {*} property     
     */
    static setObjectMetaProperty(object: any, propertyName: string, property: any) {

        let metaPropertyName = ExpressionsHelper.getMetaPropertyName(propertyName);

        object[metaPropertyName] = property;

    }


    /**
     * Returns a meta property from an object 
     * 
     * @static
     * @param {*} object
     * @param {string} propertyName
     * @returns
     */
    static getObjectMetaProperty(object: any, propertyName: string) {

        let metaPropertyName = ExpressionsHelper.getMetaPropertyName(propertyName);

        return object[metaPropertyName];

    }


    /**
     * Build a meta property name from a property name . __propertyName__ 
     * 
     * @private
     * @static
     * @param {string} propertyName
     * @returns
     */
    private static getMetaPropertyName(propertyName: string) {

        return `__${propertyName}__`;

    }

    private static getCompiledFunction(...args:string[]) {
        var key = args.join("_");
        var fn = ExpressionsHelper.compiledFunctions.get(key);
        if (!fn) {
            fn = Function.apply(null, args);
            ExpressionsHelper.compiledFunctions.set(key, Function.apply(null, args));
        }
        return fn;
    }
}