
/**
 * Component class definition 
 * 
 * @export
 * @class Component
 */
export class Component{

    /**
     * The viewModel of the component 
     * 
     * @type {*}
     */
    public viewModel:any;
    
    /**
     * The view element of the component 
     * 
     * @type {HTMLElement}
     */
    public view:HTMLElement;
    
    /**
     * Inner components of the component 
     * 
     * @type {Array<Component>}
     */
    public components:Array<Component>;
<<<<<<< HEAD
    
    
=======
        
>>>>>>> b28f636b5a68a55592dbc7de28eb77bd4a442e31
    /**
     * Creates an instance of Component.
     * 
     * @param {*} viewModel Thhe viewModel of the component 
     * @param {HTMLElement} view The view of the component
     * @param {Array<Component>} components The inner components
     */
    constructor(viewModel:any,view:HTMLElement,components:Array<Component>) {      
        this.viewModel = viewModel;
        this.view = view;
<<<<<<< HEAD
        this.components = components;
        
=======
        this.components = components;        
>>>>>>> b28f636b5a68a55592dbc7de28eb77bd4a442e31
    }
    
}