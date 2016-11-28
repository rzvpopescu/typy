import {IBinder} from '../IBinder'
import {ExpressionsHelper} from '../ExpressionsHelper';
import {Loader} from '../../Loader';
import {ComponentBinder} from './ComponentBinder';

const IMPORT_META_PROPERTY: string = 'import';
const IMPORT_FROM_ATTR: string = 'from';
const CUSTOM_COMPONENTS_META_PROPERTY = 'customComponent';

class ImportedResource {

    public path: string;

    public resource: any;

    /**
     * Creates a imported resource object
     */
    constructor(res: any, path: string) {

        this.resource = res;

        this.path = path;

    }

}

export class ImportComponentBinder implements IBinder {

    /**
        * Parses and proceess the bindings of a HTML elements
        * 
        * @param {*} viewModel
        * @param {HTMLElement} view
        * @returns {Promise<boolean>}
        */
    bind(viewModel: any, view: HTMLElement): Promise<boolean> {

        return this.bindImports(viewModel, view).then(result=>{

            return this.bindCustomComponents(viewModel,view);

        });        
    }


    bindCustomComponents(viewModel: any, view: HTMLElement): Promise<boolean> {

        let importMeta: Array<ImportedResource> = ExpressionsHelper.getObjectMetaProperty(viewModel, IMPORT_FROM_ATTR);

        if (importMeta) {

            let bindPromises = importMeta.map((imp: ImportedResource) => {

                let customComponentName = ExpressionsHelper.getObjectMetaProperty(imp.resource, CUSTOM_COMPONENTS_META_PROPERTY);

                if (customComponentName) {
                    
                    let elements = view.getElementsByTagName(customComponentName);

                    if(elements.length > 0){

                        return  Array.prototype.map.call(elements,(element:HTMLElement)=>{

                            return new ComponentBinder().bind(imp.path,element);

                        });

                    }

                    return Promise.resolve(true);

                }

                return Promise.resolve(true);
            });

           return Promise.all(bindPromises).then(result=>{

               return true;

           }) 
        }
    }

    bindImports(viewModel: any, view: HTMLElement): Promise<boolean> {

        let imports = view.getElementsByTagName(IMPORT_META_PROPERTY) || new Array<HTMLElement>();

        let importsBindings = Array.prototype.map.call(imports, (imp: HTMLElement) => {

            let fromAttr = imp.getAttribute(IMPORT_FROM_ATTR);

            return Loader.getScriptResource(fromAttr).then((result: any) => {

                let importedResource = new ImportedResource(result, fromAttr);

                let importMeta: Array<ImportedResource> = ExpressionsHelper.getObjectMetaProperty(viewModel, IMPORT_FROM_ATTR);

                if (!importMeta) {

                    importMeta = new Array<ImportedResource>();

                    ExpressionsHelper.setObjectMetaProperty(viewModel, IMPORT_FROM_ATTR, importMeta);

                }

                importMeta.push(importedResource);

               return true;

            });
            
        });

        return Promise.all(importsBindings).then(res=>{

                return true;

        });
    }

    /**
     * Removes bindings 
     * 
     * @returns {Promise<boolean>}
     */
    unbind(): Promise<boolean> {

        return Promise.resolve(true);

    }

}