
/**
 * Helper class for HTML manipulation
 * 
 * @export
 * @class HtmlEvaluator
 */
export class HtmlHelper{
    
    /**
     * Creates a HTML Element from a text source
     * 
     * @static
     * @param {string} elementSource The source of the Element
     * @returns {HTMLElement} The created HTML Element
     */
    static createHTMLElement(elementSource:string):HTMLElement{                  
        let wrapper = document.createElement('component');
        wrapper.innerHTML = elementSource;
        return wrapper as HTMLElement;    
    }
    


    /**
     * Creates and empty HTMLElement 
     * 
     * @static
     * @returns {HTMLElement}
     */
    static createEmptyElement(type?:string):HTMLElement{        
        type = type || 'div';        
        let wrapper = document.createElement(type);
        return wrapper;
    }

    /**
     * Adds a child html element to a parent html element  
     * 
     * @static
     * @param {HTMLElement} parentElement
     * @param {HTMLElement} childElement
     */
    static addHtmlElement(parentElement:HTMLElement,childElement:HTMLElement){

        //??

    }

    /**
     * Removes all chldren of an element 
     * 
     * @static
     * @param {HTMLElement} element
     */
    static clearChildrens(element:HTMLElement):void{        
        while(element.firstChild){
            element.removeChild(element.firstChild);
        }
    }

    static forEeachChildren(element:HTMLElement,callbackfn:(child:HTMLElement)=>void){        
        while(element.firstChild){
            if(callbackfn){
                callbackfn(<HTMLElement>element.firstChild)
            }
        }
    }
}