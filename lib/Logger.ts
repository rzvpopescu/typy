/**
 * Logging utilities
 * 
 * @export
 * @class Logger
 */
export class Logger{

    private static ERROR_COLOR:string = 'color:red';
    private static DEBUG_COLOR:string = 'color:magenta';
    private static INFO_COLOR:string = 'color:blue';
    
    /**
     * Logs an error message
     * 
     * @static
     * @param {string} message
     */
    static logError(message:string):void {
        console.error("%c[Typy] - ## ERRORR ## "+message,Logger.ERROR_COLOR);
    }

    /**
     * Logs a debug message
     * 
     * @static
     * @param {string} message
     */
    static logDebug(message:string):void {
        console.log("%c[Typy] - ## DEBUG ## "+message,Logger.DEBUG_COLOR);
    }

    /**
     * Logs an info message 
     * 
     * @static
     * @param {string} message
     */
    static logInfo(message:string):void {
        console.log("%c[Typy] - ## INFO ## "+message,Logger.INFO_COLOR);        
    }
}
