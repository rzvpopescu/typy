import {ComponentBinder} from './Bindings/ComponentBindings/ComponentBinder';
import {Component} from './Bindings/ComponentBindings/Component';
/**
 * Binding helper
 * 
 * @export
 * @class Binder
 */
export class Binder {

    /**
     *  Parses the elements with bindings from the given view and atatches them to the view root
     * 
     * @static
     * @param {HTMLElement} view
     * @param {HTMLElement} parentElement
     */
    static executeBindings(view: HTMLElement) {
        let componentBinder: ComponentBinder = new ComponentBinder();
        componentBinder.executeBindings(view);
    }

    /*
    * Loads a component, parses it's bindings and attaches it to the parentView
    */
    static bindComponent(parentView:HTMLElement,viewPath:string):Promise<Component>{
        let componentBinder: ComponentBinder = new ComponentBinder();
        return componentBinder.bind(viewPath,parentView);        
    }
}