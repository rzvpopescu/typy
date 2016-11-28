import {Router,Route} from 'Router';

export default class App{

    title:string =  'A simple TypeScript Framework ';
    router:Router;

    constructor(){
        this.router =  new Router();

        this.router.addRoute(new Route(['','home'],'app/demo/pages/home','Introduction'));
        this.router.addRoute(new Route('common-bindings','app/demo/pages/common-bindings','Common bindings'));
        this.router.addRoute(new Route('router','app/demo/pages/router','Router'));
        this.router.addRoute(new Route('custom-components','app/demo/pages/custom-components','Custom components'));
        this.router.addRoute(new Route('di','app/demo/pages/di','Dependency injection'));

    }
}