
/**
 *  Application boostrap class
 * 
 * @export
 * @class Application
 */

import {Logger} from './Logger';
import {Binder} from './Binder';
import {Injector} from './Injector';
import {Component} from './Bindings/ComponentBindings/Component';

const CONFIGURE_METHOD_NAME:string = 'configure';

export class Application{

    protected startUpModulePath:string = '/app';

    protected appHost:string = 'main-host';
  
    protected mainComponent:Component = undefined;

    /**
     *  Sets the title of the application
     * 
     * @param {string} title
     */
    setTitle(title:string):Application{
        
        window.document.title = title;

        Logger.logInfo(`Application - Title set to ${title} . `);

        return this;

    }

    
    /**
     * Sets the application host id 
     * 
     * @param {string} appHost
     */
    setAppHost(appHost:string):Application{

        this.appHost = appHost;

        Logger.logInfo(`Application - AppHost set to ${appHost} . `);

        return this;

    }

   
    

    /**
     * Starts the application loading the module at specified path; If no module path is specified, it will load for the 'app' path; 
     * 
     * @param {string} modulePath
     */
    startUp(modulePath?:string):Application{

        this.startUpModulePath = modulePath || this.startUpModulePath;

        Logger.logInfo(`Application - Starting application with starting module at path ${this.startUpModulePath} . `);

        this.bootUp();

        return this;
    }
           
    
    
    /**
     * Boots the application 
     * 
     * @private
     */
    private bootUp(){

        let appHostElement = this.getAppHostElement();

        Binder.bindComponent(appHostElement,this.startUpModulePath).then(component=>{
            
            this.mainComponent = component;
            
            let configureMethod = component.viewModel[CONFIGURE_METHOD_NAME];

            if(configureMethod && typeof configureMethod === 'function'){

                configureMethod.call(component.viewModel,this);

            }

        });
        
    }

    /**
     * Gets and returns the application host html element 
     * 
     * @private
     */
    private getAppHostElement():HTMLElement{

        return window.document.getElementById(this.appHost);

    }

    static  startUp(modulePath?:string):void{

        let app = Injector.resolveType(Application);

        app.startUp(modulePath);
        
    }
    
}

Injector.registerInstance(Application,new Application());