import {MetaHelper} from '../MetaHelper';

/**
 * Observer mechanism 
 * 
 * @class Observer
 */
const OBSERVER: string = 'observer';

/**
 * Observer subscription object 
 * 
 * @class ObserverSubscription
 */
class ObserverSubscription {

    oldValue: any;

    value: any;

    expression: string;

    callbacks: Array<Function>

    initialized: boolean;

    instance: any;

    evaluator: Function;

    /**
     * Creates an instance of ObserverSubscription.
     * 
     */
    constructor(expression: string, instance: any) {

        this.expression = expression;

        this.instance = instance;

        this.callbacks = new Array<Function>();

        this.initialized = false;

    }


    /**
     * Adds a callback for the Observer subscription 
     * 
     * @param {(oldValue:any,newValue:any)=>void} callback
     */
    addCallback(callback: (value: any, oldValue: any) => void): void {

        this.callbacks.push(callback);

        if (this.initialized) {

            callback.call(this.instance, this.value, this.oldValue);

        }

    }


    /**
     * Removes the callback for the current subscription 
     * 
     * @param {(oldValue:any,newValue:any)=>void} callback
     */
    removeCallback(callback: (value: any, oldValue: any) => void): void {

        this.callbacks.splice(this.callbacks.indexOf(callback), 1);

    }


    /**
     * Evaluates the subscriptions and triggers the callbacks if needed 
     */
    evaluate() {

        let expressionValue = this.getExpressionValue(this.expression, this.instance);

        if (expressionValue !== this.value) {

            this.initialized = true;

            this.oldValue = this.value;

            this.value = expressionValue;

            this.triggerCallbacks();

            if (Array.isArray(this.value)) {

                this.subscribeToArrayChanges(this.value, () => this.triggerCallbacks());

            }

            if (Array.isArray(this.oldValue)) {

                this.unsubscribeFromArrayChanges(this.oldValue);

            }
        }

    }

    triggerCallbacks() {
        this.callbacks.forEach(callback => {

            callback.call(this.instance, this.value, this.oldValue);

        });
    }

    subscribeToArrayChanges(array: any[], onChange: () => void) {

        ['push', 'splice', 'pop'].forEach(fnName => {

            var original = (<any>array)[fnName].bind(array);

            Object.defineProperty(array, fnName, {
                get: () => {
                    setTimeout(() => onChange(), 0);
                    //onChange();
                    return original;
                }
            });

        });

    }

    unsubscribeFromArrayChanges(array: any[]) {
        // TODO do something
    }


    /**
     * Gets and returns the value of the expression 
     * 
     * @param {string} expression
     * @param {*} instance
     * @returns {*}
     */
    getExpressionValue(expression: string, instance: any): any {

        if (!this.evaluator)
            this.evaluator = new Function("_", "return _." + expression.trim())

        let evaluatedExpression = this.evaluator(instance);

        return evaluatedExpression;

    }

}


/**
 * Observer mechanism 
 * 
 * @class Observer
 */
class Observer {

    /**
     * The subscription 
     * 
     * @private
     * @type {Map<string,Array<Function>>}
     */
    private subscriptions: Array<ObserverSubscription> = new Array<ObserverSubscription>();


    /**
     * The instance of the current observer 
     * 
     * @private
     * @type {*}
     */
    private instance: any;

    /**
     * Initializes the observer mechanism on given instance
     * 
     * @param {*} instace the instance
     */
    constructor(instance: any) {

        this.instance = instance;

        this.monitorSubscriptionsChanges();

    }


    /**
     * Ataches the observer mechanism to the given expression 
     * 
     * @param {string} expression The watched expression
     * @param {(value:any,oldValue?:any)=>void} callback The callback to be executed when the value is changed
     */
    observe(expression: string, callback: (value: any, oldValue?: any) => void): void {

        let subscription: ObserverSubscription = this.getExpressionSubscription(expression);

        if (!subscription) {

            subscription = this.createExpressionSubscription(expression);

        }

        subscription.addCallback(callback);

        //first evaluation        
        if (!subscription.initialized) {

            subscription.evaluate();

        }

    }


    /**
     * Creates a subscription for a given expresession 
     * 
     * @param {string} expression
     * @returns {ObserverSubscription}
     */
    createExpressionSubscription(expression: string): ObserverSubscription {

        let subscription = new ObserverSubscription(expression, this.instance);

        this.subscriptions.push(subscription);

        return subscription;

    }


    /**
     * Gets and returns the subscription for a given expression 
     * 
     * @param {string} expression
     * @returns {ObserverSubscription}
     */
    getExpressionSubscription(expression: string): ObserverSubscription {

        return this.subscriptions.find((subscription: ObserverSubscription) => {

            return subscription.expression === expression;

        });

    }


    /**
     * Returns the value of an observerd expression that belongs to current observer instance 
     * 
     * @param {string} expression
     * @returns {String}
     */
    getExpressionValue(expression:string):String{

        let subscription = this.getExpressionSubscription(expression);

        if(subscription){

            return subscription.value;

        }
        
        return undefined;
    }

    /**
     *  Monitors for subscriptions changes
     */
    monitorSubscriptionsChanges(): void {

        this.subscriptions.forEach(subscription => {

            subscription.evaluate();

        });

        setTimeout(this.monitorSubscriptionsChanges.bind(this), 100);
    }

}

class ObserverEngine {

    /**
     * Observes the expression for a given instance  
     * 
     * @static
     * @param {string} expression The observed expression
     * @param {*} instance The instance
     * @param {Function} callback The callback of that expression
     */
    static observeExpression(expression: string, instance: any, callback: (value: any, oldValue?: any) => void): void {

        let observerInstance = ObserverEngine.getObserverInstance(instance);

        observerInstance.observe(expression, callback);
    }


    
    /**
     * Returns the value for the observed expression on given instance 
     * 
     * @param {string} expression
     * @param {*} instance
     */
    public static getObservedExpressionValue(expression:string,instance:any){

        let observerInstance =  ObserverEngine.getObserverInstance(instance);

        return observerInstance.getExpressionValue(expression);        

    }

    
    /**
     * Returns the observer instance associated with the given instance
     * 
     * @public
     * @static
     * @param {*} instance
     * @returns {Observer}
     */
    public static getObserverInstance(instance:any):Observer{

        return ObserverEngine.assureObserverMetaProperty(instance);

    }

    /**
     *  Assures that the instance has the Observer instance attached to it's meta properties 
     * 
     * @private
     * @static
     * @param {*} instance The instance
     * @returns {Observer} The Observer instance
     */    
    private static assureObserverMetaProperty(instance: any): Observer {

        let observerInstance = MetaHelper.getMetaProperty(instance, OBSERVER);

        if (!observerInstance) {

            observerInstance = new Observer(instance);

            MetaHelper.setMetaProperty(instance, OBSERVER, observerInstance);

        }

        return observerInstance;

    }
}

export {ObserverEngine, Observer}