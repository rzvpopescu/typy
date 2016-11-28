/**
 * Definition for a IBinder object
 * 
 * @export
 * @interface IBinder
 */
export interface IBinder{

    /**
     * Parses and proceess the bindings of a HTML elements
     * 
     * @param {*} viewModel
     * @param {HTMLElement} view
     * @returns {Promise<boolean>}
     */
    bind(viewModel:any,view:HTMLElement):Promise<boolean>;

    /**
     * Removes bindings 
     * 
     * @returns {Promise<boolean>}
     */
    unbind():Promise<boolean>;
                
}