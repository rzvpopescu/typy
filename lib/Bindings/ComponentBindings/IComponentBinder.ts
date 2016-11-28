import {Component} from './Component';
/**
 * Definition of a ComponentBinder object
 * 
 * @export
 * @interface IComponentBinder
 */
export interface IComponentBinder{

    /**
     * Parse and process the declarative bindings from a HTML view/template
     * 
     * @param {HTMLElement} view
     * @returns {Promise<boolean>}
     */
    executeBindings(view:HTMLElement):Promise<Component[]>;
    
    /**
     * Binds a component and attaches it to a HTML element
     * 
     * @param {string} componentPath
     * @param {HTMLElement} parentElement
     */
     bind(componentPath:string,parentElement:HTMLElement):Promise<Component>;


     
    /**
     * Bind a viewmodel against it's view and adds it to the parent view; 
     * 
     * @param {*} viewModelInstance
     * @param {HTMLElement} view
     * @param {HTMLElement} parentView
     * @returns {Promise<Component>}
     */
    bindModel(viewModelInstance: any, view: HTMLElement,parentView:HTMLElement): Promise<Component>;

    /**
     * Remove the elements binded to a HTML view/template
     * 
     * @returns {Promise<boolean>}
     */
    unbind():Promise<boolean>;     
    
     
    
}