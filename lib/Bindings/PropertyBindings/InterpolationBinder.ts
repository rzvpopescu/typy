import {PropertyBinder} from './PropertyBinder';
import {ExpressionsHelper} from '../ExpressionsHelper';
import {ObserverEngine} from '../../Observer/Observer';

const INTERPOLATION_PATTERN:RegExp = /\${.+?\}/g;

export class InterpolationBinder extends PropertyBinder{

    bind(viewModel: any, view: HTMLElement): Promise<boolean> {
        
        let interpolationNodes = this.getChildrenWithInterpolationExpression(view);

        interpolationNodes.forEach((node:Node) =>{

            this.interpolationNodeBind(node as HTMLElement,viewModel);

        });
               
        return Promise.resolve(true); 
    }

    
    /**
     * Bind the interpolation node 
     * 
     * @param {HTMLElement} element The element node
     * @param {*} viewModel the ViewModel     
     */
    interpolationNodeBind(element: HTMLElement, viewModel: any): void {

        let textContent = element.textContent;

        let expressions = this.getExpressions(textContent);

        expressions.forEach(expression=>{

            ObserverEngine.observeExpression(expression,viewModel,(value:any,oldValue:any)=>{
            
                 this.updateInterpolations(element,viewModel,expressions,textContent);

            });

        });

        this.updateInterpolations(element,viewModel,expressions,textContent);

    }
    
    
    /**
     * Updates all the interpolation expressions of the given element 
     * 
     * @param {HTMLElement} element
     * @param {*} viewModel
     * @param {Array<string>} expressions
     * @param {string} contentTemplate
     */
    updateInterpolations(element:HTMLElement,viewModel:any,expressions:Array<string>,contentTemplate:string){

        let textContent = contentTemplate;

        expressions.forEach(expression=>{

            let bindingExpression:string = this.createExpressionBinding(expression);

            let value = ObserverEngine.getObservedExpressionValue(expression,viewModel);

            textContent = textContent.replace(bindingExpression,value);

        });

        element.textContent  = textContent;

    }
    
    /**
     * Parses an interpolated content and returns the expressions used for interpolation 
     * 
     * @param {string} interpContent
     * @returns {Array<string>}
     */
    getExpressions(interpContent:string):Array<string>{

        let  interpExpressions = interpContent.match(INTERPOLATION_PATTERN);

        return Array.prototype.map.call(interpExpressions,(expression:string)=>{

            return this.getExpressionFromBinding(expression);

        });       

    }

    /**
     * Gets the expression from the interpolation expression/binding . ${someMember} -> someMember 
     * 
     * @param {String} binding
     * @returns
     */
    getExpressionFromBinding(binding:String){

        return binding.replace(/[${}]/g,"");  

    }

    
    /**
     * Creates a interpolation binding expressions from an expressions 
     * 
     * @param {String} expression
     */
    createExpressionBinding(expression:String):string{

        return '${'+expression+'}';

    }

    
    /**
     * Checks if node has invalid bindings . For binding is not compatible with interpolation binding ;
     * 
     * @param {Node} node The node
     * @returns true or false
     */
    nodeHasInvalidBindings(node:Node){
        
        let invalidBindingsFound:boolean =  false;
    
        let invalidBindings:string[] = ['for.bind'];

        invalidBindings.forEach(binding=>{
            
            let element:HTMLElement =  node as HTMLElement;

            if(element.hasAttribute(binding)){

                invalidBindingsFound =  true;
                
            }

        });

        return invalidBindingsFound;
    }

    /**
     * Gets the children nodes containing interpolation bindings 
     * 
     * @param {HTMLElement} element The element
     * @returns {Array<Node>} The nodes that contain interpolation expressions
     */
    getChildrenWithInterpolationExpression(element:HTMLElement):Array<Node>{
        
        // filter only the textnodes. if the node has invalid bindings, do not traverse it    
        let nodeChecker = {

            acceptNode:function(node:Node):number{
                                
                if(node.nodeType === Node.TEXT_NODE){

                    return NodeFilter.FILTER_ACCEPT;

                }
                else{

                    if(this.nodeHasInvalidBindings(node)){

                        return NodeFilter.FILTER_REJECT;

                    }

                    return NodeFilter.FILTER_SKIP;
                }
                
            }.bind(this)

        }
        
        let treeWalker:TreeWalker = document.createTreeWalker(element,NodeFilter.SHOW_TEXT+NodeFilter.SHOW_ELEMENT,nodeChecker,false);

        let nodes:Array<Node> =  new Array<Node>();

        let node:Node;

        while(node = treeWalker.nextNode()){

            if(node.textContent.match(INTERPOLATION_PATTERN)){

                nodes.push(node);

            }

        }

        return nodes;

    }

}