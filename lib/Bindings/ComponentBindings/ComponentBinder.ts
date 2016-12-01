import {IComponentBinder} from './IComponentBinder';
import {Loader} from '../../Loader';
import {LifeCycler} from '../../Lifecycler';
import {BindingEngine} from '../BindingEngine';
import {Component} from './Component';
import {Activator} from '../../Activator';
import {HtmlHelper} from '../HtmlHelper';
import {MetaHelper} from '../../MetaHelper';
import {Logger} from '../../Logger';

export class ComponentBinder implements IComponentBinder {

    protected BINDING_ATTRIBUTE: string = "component.bind";

    
    /**
     * Indicates that the binding process is canceled and should be dispose
     * 
     * @private
     * @type {boolean}
     */
    private disposePending:boolean = false;

    //#region Public Methods

    /**
     * Parses the view and applies the bindings 
     * 
     * @param {HTMLElement} view
     * @returns {Promise<boolean>}
     */
    executeBindings(view: HTMLElement): Promise<Component[]> {

        let elementsWithBindigs = view.querySelectorAll(this.bindingQuerySelector);

        if (!elementsWithBindigs || elementsWithBindigs.length == 0)
            return Promise.resolve(undefined);

        let componentsPromise = Array.prototype.map.call(elementsWithBindigs, (element: HTMLElement) => {

            let expression = element.getAttribute(this.bindingAttribute);

            return this.componentBind(element, expression);

        });

        return Promise.all(componentsPromise).then(result => {
            return result.map(res => { return res as Component });
        });
    }


    /**
     * Bind a viewmodel against it's view and adds it to the parent view; 
     * 
     * @param {*} viewModelInstance
     * @param {HTMLElement} view
     * @param {HTMLElement} parentView
     * @returns {Promise<Component>}
     */
    bindModel(viewModelInstance: any, view: HTMLElement, parentView: HTMLElement): Promise<Component> {
        return this.bindViewModel(viewModelInstance, view, parentView);
    }

    /**
     * Loads the component at given path and applies it's bindings 
     * 
     * @param {string} componentPath
     * @param {HTMLElement} parentView
     * @returns {Promise<Component>}
     */
    bind(componentPath: string, parentView: HTMLElement, data?: any): Promise<Component> {
        return new Promise<Component>((resolve,reject)=>{
            this.componentBind(parentView, componentPath, data).then((component: Component)=> resolve(component)).catch((err:Error)=>{                 
                Logger.logError(`Could not bind the component at path << ${componentPath} >> . ${err.message} !`);                
            });
        });
    }
    
    /**
     * Unbinds the component
     * 
     * @returns
     * 
     * @memberOf ComponentBinder
     */
    unbind() {        
        this.disposePending =  true;
        return Promise.resolve(true);
    }

    
    /**
     * Returns the binding attribute
     * 
     * @readonly
     * @type {string}
     * @memberOf ComponentBinder
     */
    get bindingAttribute(): string {
        return this.BINDING_ATTRIBUTE;
    }

    
    /**
     * Returns the binding query selector
     * 
     * @readonly
     * @type {string}
     * @memberOf ComponentBinder
     */
    get bindingQuerySelector(): string {
        let escapedBindingAttribute = this.bindingAttribute.replace(/\./g, '\\.');
        return `[${escapedBindingAttribute}]`;
    }

    //#endregion Public Methods

    //#region Private Methods
    
    /**
     * Checks if there is any cancelation request while binding the component
     * 
     * @private
     * 
     * @memberOf ComponentBinder
     */
    private checkCancelation(){        
        if(this.disposePending){
            throw new Error('Binding canceled by the navigation/routing system .');
        }
    }

    
    /**
     * Binds the component
     * 
     * @private
     * @param {HTMLElement} parentView
     * @param {string} componentPath
     * @param {*} [data]
     * @returns {Promise<Component>}
     * 
     * @memberOf ComponentBinder
     */
    private componentBind(parentView: HTMLElement, componentPath: string, data?: any): Promise<Component> {
        return this.loadComponent(parentView, componentPath, null, data);
    }

    
    /**
     * Loads a component from a given path and attaches it to the parent element
     * 
     * @private
     * @param {HTMLElement} targetElement
     * @param {string} componentPath
     * @param {string} [viewPath]
     * @param {*} [data]
     * @returns {Promise<Component>}
     * 
     * @memberOf ComponentBinder
     */
    private loadComponent(targetElement: HTMLElement, componentPath: string, viewPath?: string, data?: any): Promise<Component> {

        this.checkCancelation();

        //if no viewPath is provided-> use the same path as viewmodel
        viewPath = viewPath || componentPath;
        //load the viewmodel js source
        return Loader.getScriptResource(componentPath).then(viewModel => {

            this.checkCancelation();

            // create a viewmodel instance
            let viewModelInstance = this.instantianteViewModel(viewModel);
            // assure the viewmodel allows loading
            return LifeCycler.callCanLoadHook(viewModelInstance, data).then(result => {

                this.checkCancelation();

                if (result) {
                    //call the load hook and send the data
                    return LifeCycler.callLoadHook(viewModelInstance, data).then(loadResult => {

                        this.checkCancelation();

                        //get html source
                        return Loader.getHTMLResource(viewPath).then(viewSource => {

                            this.checkCancelation();

                            // create an HTML element from the html source
                            let view: HTMLElement = HtmlHelper.createHTMLElement(viewSource);
                            view.setAttribute('data-component-path', componentPath);
                            view.setAttribute('data-view-path', viewPath);
                            return this.bindViewModel(viewModelInstance, view, targetElement);
                        });
                    });
                }
                throw new ComponentCannotLoadError(`'The component ${componentPath} can not load! Can load hook returned false!`);
            });
        });
    }

    
    /**
     * Bind a viewmodel to a view and attaches the view to a parent element(target)
     * 
     * @private
     * @param {*} viewModelInstance
     * @param {HTMLElement} view
     * @param {HTMLElement} targetElement
     * @returns {Promise<Component>}
     * 
     * @memberOf ComponentBinder
     */
    private bindViewModel(viewModelInstance: any, view: HTMLElement, targetElement: HTMLElement):Promise<Component> {
        
        this.checkCancelation();

        // apply the binders
        BindingEngine.applyBinders(viewModelInstance, view);

        //bind contained elements
        return this.executeBindings(view).then(components => {

            this.checkCancelation();

            //call the binded hook
            return LifeCycler.callBindedHook(viewModelInstance).then(bindedResult => {

                this.checkCancelation();

                // attach component to parent component
                return this.attachComponent(targetElement, view).then(result => {

                    this.checkCancelation();

                    //call the attached hook on that viewmodel
                    return LifeCycler.callAttachedHook(viewModelInstance).then(attachedResult => {

                        this.checkCancelation();

                        return new Component(viewModelInstance, view, components);

                    });
                });
            });
        });
    }

    
    /**
     * Attaches an element to a target/parent element
     * 
     * @private
     * @param {HTMLElement} targetElement
     * @param {HTMLElement} component
     * @returns {Promise<boolean>}
     * 
     * @memberOf ComponentBinder
     */
    private attachComponent(targetElement: HTMLElement, component: HTMLElement): Promise<boolean> {
        targetElement.appendChild(component);
        return Promise.resolve(true);
    };

    
    /**
     * Instantiates the viewmodel
     * 
     * @private
     * @param {*} viewModel
     * @returns {*}
     * 
     * @memberOf ComponentBinder
     */
    private instantianteViewModel(viewModel: any): any {

        return Activator.activate(viewModel);

    }
        
    //#endregion Private Methods
}

class ComponentCannotLoadError extends Error {

}