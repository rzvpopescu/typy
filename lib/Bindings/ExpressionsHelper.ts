
export interface CompiledFunction {
    (viewModel: any, context?: any): any;
}

export interface CompiledSetterFunction {
    (viewModel: any, valueToSet: any): any;
}

/**
 * Helper for expression manipulation 
 * 
 * @export
 * @class ExpressionEvaluator
 */
export class ExpressionsHelper {
    private static compiledFunctions: Map<string, Function> = new Map<string, Function>();

    /**
     * Compile the expression, and evaluate it for the given viewModel
     * @param {string} expression
     * @param {*} viewModel
     */
    static getEvaluatedExpression(expression: string, viewModel: any): any {

        const expressionFunction = ExpressionsHelper.compileExpression(expression);

        const result = expressionFunction(viewModel);

        return result;

    }

    /**
     * Compile the given expression.
     * The resulting function will have two parameters: the viewModel and the context.
     * The context parameter is optional
     *  and it can be used to add additional variables which can be used in the function
     * eg. for an event the context could be { event: new Event() }
     */
    static compileExpression(expression: string): CompiledFunction {

        let expressionFunction = ExpressionsHelper.getCompiledFunction("viewModel", "context",
            "context = context || {};"
            + "with(context) with(viewModel) return "
            + "viewModel." + expression);

        return expressionFunction as CompiledFunction;

    }

    /**
     * Compiles an expression which sets a value on the viewModel
     * See compileExpression() for details.
     */
    static compileSetterExpression(expression: string): CompiledSetterFunction {

        let fn = ExpressionsHelper.getCompiledFunction("viewModel", "value",
            "return viewModel." + expression + " = value");

        return fn as CompiledSetterFunction;

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

    private static getCompiledFunction(...args: string[]) {
        var key = args.join("_");
        var fn = ExpressionsHelper.compiledFunctions.get(key);
        if (!fn) {
            fn = Function.apply(null, args);
            ExpressionsHelper.compiledFunctions.set(key, Function.apply(null, args));
        }
        return fn;
    }
}